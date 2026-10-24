"use client";

import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, ChevronDown, CircleDollarSign, Download, ExternalLink, HeartHandshake, MoreHorizontal, RefreshCcw, Search, UsersRound } from "lucide-react";

type DonationStatus = "Succeeded" | "Pending" | "Refunded" | "Failed";
type Donation = { id: string; donor: string; email: string; amount: number; frequency: "One-time" | "Monthly"; designation: string; date: string; status: DonationStatus; anonymous?: boolean };

const previewDonations: Donation[] = [
  { id: "SH-1048", donor: "Maya Thompson", email: "maya@example.org", amount: 100, frequency: "Monthly", designation: "Where needed most", date: "2026-10-10T17:42:00Z", status: "Succeeded" },
  { id: "SH-1047", donor: "Anonymous donor", email: "hidden@example.org", amount: 250, frequency: "One-time", designation: "Education Access", date: "2026-10-09T20:15:00Z", status: "Succeeded", anonymous: true },
  { id: "SH-1046", donor: "David Lee", email: "david@example.org", amount: 50, frequency: "One-time", designation: "Annual Hope Gala", date: "2026-10-09T15:08:00Z", status: "Pending" },
  { id: "SH-1045", donor: "Amara Johnson", email: "amara@example.org", amount: 75, frequency: "Monthly", designation: "Health & Wellness", date: "2026-10-08T18:31:00Z", status: "Succeeded" },
  { id: "SH-1044", donor: "Noah Williams", email: "noah@example.org", amount: 40, frequency: "One-time", designation: "Community Development", date: "2026-10-07T13:20:00Z", status: "Refunded" },
];

const statusStyle: Record<DonationStatus, string> = {
  Succeeded: "bg-emerald-100 text-emerald-800",
  Pending: "bg-amber-100 text-amber-800",
  Refunded: "bg-slate-100 text-slate-600",
  Failed: "bg-red-100 text-red-700",
};

export function DonationsAdminTemplate() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | DonationStatus>("All");
  const [frequency, setFrequency] = useState<"All" | Donation["frequency"]>("All");
  const [showPreview, setShowPreview] = useState(true);
  const donations = useMemo(() => showPreview ? previewDonations : [], [showPreview]);
  const filtered = useMemo(() => donations.filter((donation) => {
    const matchesStatus = status === "All" || donation.status === status;
    const matchesFrequency = frequency === "All" || donation.frequency === frequency;
    const text = `${donation.donor} ${donation.email} ${donation.id} ${donation.designation}`.toLowerCase();
    return matchesStatus && matchesFrequency && text.includes(query.toLowerCase());
  }), [donations, frequency, query, status]);
  const succeeded = donations.filter((donation) => donation.status === "Succeeded");
  const total = succeeded.reduce((sum, donation) => sum + donation.amount, 0);
  const monthly = succeeded.filter((donation) => donation.frequency === "Monthly");

  return <div className="bg-[#F5F6F4] p-6 lg:p-8">
    <div className="mx-auto max-w-7xl space-y-7">
      <section className="flex flex-col justify-between gap-5 rounded-3xl bg-brand-navy p-7 text-white lg:flex-row lg:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#FFC72C]">Giving operations</p><h1 className="mt-3 font-serif text-4xl font-bold">Donations</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">Review gifts, recurring support, designations, receipts, and payment status from one place.</p></div>
        <button type="button" disabled className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white/70"><Download size={17} />Export CSV</button>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-950"><div><strong>Template preview</strong><span className="ml-2 text-amber-800">These example transactions are not real donations. Live records will appear after a payment provider is connected.</span></div><label className="flex shrink-0 items-center gap-2 font-bold"><input type="checkbox" checked={showPreview} onChange={(event) => setShowPreview(event.target.checked)} />Show sample data</label></div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total received", value: `$${total.toLocaleString()}`, detail: "Successful preview gifts", icon: CircleDollarSign },
          { label: "This month", value: `$${total.toLocaleString()}`, detail: `${succeeded.length} successful donations`, icon: CalendarDays },
          { label: "Monthly support", value: `$${monthly.reduce((sum, donation) => sum + donation.amount, 0).toLocaleString()}`, detail: "Estimated recurring amount", icon: RefreshCcw },
          { label: "Monthly donors", value: monthly.length, detail: "Active preview supporters", icon: UsersRound },
        ].map(({ label, value, detail, icon: Icon }) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-500">{label}</p><Icon className="text-brand-green" size={19} /></div><p className="mt-3 text-3xl font-bold text-brand-navy">{value}</p><p className="mt-1 text-xs text-slate-400">{detail}</p></div>)}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-200 p-5"><div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center"><div><h2 className="font-bold text-brand-navy">Donation activity</h2><p className="mt-1 text-xs text-slate-500">Search and filter gifts by donor, status, frequency, or designation.</p></div><div className="flex flex-wrap gap-2"><label className="relative min-w-64 flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search donations" className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-green" /></label><label className="relative"><select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm font-semibold"><option>All</option><option>Succeeded</option><option>Pending</option><option>Refunded</option><option>Failed</option></select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} /></label><label className="relative"><select value={frequency} onChange={(event) => setFrequency(event.target.value as typeof frequency)} className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm font-semibold"><option>All</option><option>One-time</option><option>Monthly</option></select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} /></label></div></div></header>

        {filtered.length ? <div className="overflow-x-auto"><table className="w-full min-w-[960px] text-left"><thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-[.14em] text-slate-500"><tr><th className="px-5 py-3">Donor</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Frequency</th><th className="px-4 py-3">Designation</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Reference</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((donation) => <tr key={donation.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><p className="text-sm font-bold text-brand-navy">{donation.donor}</p><p className="mt-0.5 text-xs text-slate-400">{donation.anonymous ? "Hidden publicly" : donation.email}</p></td><td className="px-4 py-4 text-sm font-bold text-brand-navy">${donation.amount.toFixed(2)} <span className="text-[10px] text-slate-400">USD</span></td><td className="px-4 py-4 text-sm text-slate-600">{donation.frequency}</td><td className="px-4 py-4"><span className="inline-flex items-center gap-1.5 text-sm text-slate-600"><HeartHandshake size={14} className="text-brand-green" />{donation.designation}</span></td><td className="px-4 py-4 text-sm text-slate-600">{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(donation.date))}</td><td className="px-4 py-4"><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusStyle[donation.status]}`}>{donation.status === "Succeeded" && <CheckCircle2 size={11} />}{donation.status}</span></td><td className="px-4 py-4 font-mono text-xs text-slate-500">{donation.id}</td><td className="px-5 py-4 text-right"><button type="button" title="Donation actions become available after payment integration" className="rounded-lg border border-slate-200 p-2 text-slate-400"><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div> : <div className="p-14 text-center"><CircleDollarSign className="mx-auto text-slate-300" size={40} /><h3 className="mt-4 font-bold text-brand-navy">No donations to display</h3><p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">Connected, verified donations will appear here with payment status and receipt information.</p></div>}
      </section>

      <section className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-bold text-brand-navy">Payment provider</h3><p className="mt-2 text-sm leading-6 text-slate-500">Connect Stripe or another provider to securely collect and verify gifts.</p><button disabled className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-slate-400">Connect provider <ExternalLink size={14} /></button></div><div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-bold text-brand-navy">Receipts</h3><p className="mt-2 text-sm leading-6 text-slate-500">Automatically send branded donation confirmations and tax receipts.</p><span className="mt-4 inline-block text-xs font-bold uppercase tracking-wider text-slate-400">Requires integration</span></div><div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-bold text-brand-navy">Refunds</h3><p className="mt-2 text-sm leading-6 text-slate-500">Authorized owners can issue and track refunds from each donation record.</p><span className="mt-4 inline-block text-xs font-bold uppercase tracking-wider text-slate-400">Requires integration</span></div></section>
    </div>
  </div>;
}
