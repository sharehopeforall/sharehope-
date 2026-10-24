import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return <main className="grid min-h-[70vh] place-items-center bg-[#FAF7F2] px-6 text-center"><div><p className="font-space-mono text-xs font-bold uppercase tracking-[.2em] text-brand-green">404</p><h1 className="mt-4 font-serif text-5xl font-bold text-brand-navy">Page not found</h1><p className="mt-4 text-slate-600">The page you requested may have moved or no longer exists.</p><Link href="/" className="mt-8 inline-flex rounded bg-brand-navy px-6 py-3 font-bold text-white">Return home</Link></div></main>;
}
