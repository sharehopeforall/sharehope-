import { EventConfirmation } from "@/components/public/EventConfirmation";

export default async function EventConfirmPage({ params, searchParams }: { params:Promise<{locale:string}>; searchParams:Promise<{token?:string}> }) {
  const [{locale}, query] = await Promise.all([params, searchParams]);
  return <main className="bg-[#FAF7F2] px-6 py-20"><div className="mx-auto max-w-xl"><EventConfirmation locale={locale} token={query.token??""}/></div></main>;
}
