"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="grid min-h-[70vh] place-items-center bg-[#FAF7F2] px-6 text-center"><div><h1 className="font-serif text-4xl font-bold text-brand-navy">Something went wrong</h1><p className="mt-4 text-slate-600">We couldn’t load this page. Please try again.</p><button type="button" onClick={reset} className="mt-8 rounded bg-brand-navy px-6 py-3 font-bold text-white">Try again</button></div></main>;
}
