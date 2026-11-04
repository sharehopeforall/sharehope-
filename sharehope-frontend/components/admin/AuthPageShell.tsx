import Image from "next/image";
import { Link } from "@/i18n/navigation";
export function AuthPageShell({ title, lead, children }: { title: string; lead: string; children: React.ReactNode }) {
 return <main className="grid min-h-dvh place-items-center bg-[#F6F3EC] px-5 py-10"><section className="w-full max-w-md rounded-2xl border border-[#DDD8CF] bg-white p-7 shadow-xl sm:p-9"><Link href="/" className="inline-flex"><Image src="/logo-sharehope-blue.png" alt="ShareHope" width={174} height={55} className="h-10 w-auto"/></Link><h1 className="font-serif mt-8 text-3xl font-semibold text-brand-navy">{title}</h1><p className="mt-3 text-sm leading-6 text-slate-600">{lead}</p><div className="mt-7">{children}</div></section></main>;
}
