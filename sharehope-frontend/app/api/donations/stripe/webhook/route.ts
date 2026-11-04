/* eslint-disable @typescript-eslint/no-explicit-any */
import { createHmac, timingSafeEqual } from "node:crypto";import { NextResponse } from "next/server";import { fetchBackend } from "@/lib/server/backend-fetch";
export const runtime="nodejs";
function valid(body:string,header:string,secret:string){
  const values = header.split(",").map((value) => value.trim());
  const timestamp = values.find((value) => value.startsWith("t="))?.slice(2);
  const signatures = values.filter((value) => value.startsWith("v1=")).map((value) => value.slice(3));
  if (!timestamp || signatures.length === 0 || !/^\d+$/.test(timestamp)) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const expected=createHmac("sha256",secret).update(`${timestamp}.${body}`).digest("hex");
  return signatures.some((signature) => {
    try{return timingSafeEqual(Buffer.from(expected,"hex"),Buffer.from(signature,"hex"));}catch{return false;}
  });
}
async function receiptUrl(o:any){
  if(o.receipt_url)return o.receipt_url as string;
  if(o.hosted_invoice_url)return o.hosted_invoice_url as string;
  const paymentIntent=typeof o.payment_intent==="string"?o.payment_intent:o.payment_intent?.id;
  if(!paymentIntent||!process.env.STRIPE_SECRET_KEY)return undefined;
  const response=await fetch(`https://api.stripe.com/v1/payment_intents/${encodeURIComponent(paymentIntent)}?expand[]=latest_charge`,{headers:{Authorization:`Bearer ${process.env.STRIPE_SECRET_KEY}`}});
  if(!response.ok)return undefined;
  const intent=await response.json();
  return typeof intent.latest_charge==="object"?intent.latest_charge?.receipt_url:undefined;
}
async function record(o:any,status:string,reference:string,amount:number){
  const backendUrl=process.env.BACKEND_URL;
  const internalSecret=process.env.PAYMENT_INTERNAL_SECRET;
  if(!backendUrl||!internalSecret)throw new Error("Donation recording is not configured.");
  const metadata=o.metadata||o.parent?.subscription_details?.metadata||{};
  const response=await fetchBackend(`${backendUrl.replace(/\/$/,"")}/api/public/payment-events`,{method:"POST",headers:{"Content-Type":"application/json","X-Payment-Secret":internalSecret},body:JSON.stringify({provider:"stripe",providerReference:reference,donorName:metadata.donor_name||o.customer_details?.name||o.customer_name,donorEmail:metadata.donor_email||o.customer_details?.email||o.customer_email,donorPhone:metadata.donor_phone||o.customer_details?.phone||o.customer_phone,amountCents:Math.max(1,amount||1),currency:o.currency||"usd",frequency:o.mode==="subscription"||o.subscription||o.parent?.subscription_details?"Monthly":"One-time",designation:metadata.event||metadata.program||"general",status,receiptUrl:await receiptUrl(o)})},8000);
  if(!response.ok){
    console.error("Donation backend rejected Stripe event",response.status);
    throw new Error(`Donation backend returned ${response.status}.`);
  }
}
export async function POST(request:Request){const body=await request.text();const signature=request.headers.get("stripe-signature")||"";const secret=process.env.STRIPE_WEBHOOK_SECRET||"";if(!secret||!valid(body,signature,secret))return NextResponse.json({error:"Invalid signature"},{status:400});const event=JSON.parse(body),o=event.data.object;switch(event.type){case"checkout.session.completed":case"checkout.session.async_payment_succeeded":if(o.mode!=="subscription")await record(o,"Succeeded",o.id,o.amount_total);break;case"invoice.payment_failed":await record(o,"Failed",o.id,o.amount_due);break;case"invoice.paid":await record(o,"Succeeded",o.id,o.amount_paid);break;case"charge.refunded":await record(o,"Refunded",o.payment_intent||o.id,o.amount_refunded||o.amount);break;case"charge.dispute.created":await record(o,"Disputed",o.payment_intent||o.id,o.amount);break;case"customer.subscription.deleted":await record(o,"Cancelled",o.id,1);break;}return NextResponse.json({received:true});}
