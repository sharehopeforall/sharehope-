export default function PublicPageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="section-space border-b border-[#E2E8F0] bg-brand-cream px-6">
      <div className="mx-auto max-w-[1180px]">
        <h1 className="type-page-title text-role-primary max-w-[820px] text-balance">
          {title}
        </h1>
        {subtitle && <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{subtitle}</p>}
        <div className="mt-6 h-1 w-20 rounded-full bg-[#13306B]" aria-hidden="true" />
      </div>
    </section>
  );
}
