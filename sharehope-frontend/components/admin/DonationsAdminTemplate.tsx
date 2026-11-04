"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Download,
  ExternalLink,
  HeartHandshake,
  MoreHorizontal,
  RefreshCcw,
  Search,
  UsersRound,
  X,
} from "lucide-react";

type Donation = {
  id: string;
  provider: string;
  donor: string;
  email: string;
  phone?: string;
  amount: number;
  currency: string;
  frequency: "One-time" | "Monthly";
  designation: string;
  date: string;
  receiptUrl?: string;
  anonymous?: boolean;
};
type SortOption = "Newest" | "Oldest" | "Amount high" | "Amount low";

const formatMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);

function FilterSelect({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="max-w-48 appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-xs font-semibold text-slate-700 outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10"
        aria-label={label}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        size={14}
      />
    </label>
  );
}

export function DonationsAdminTemplate() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("Newest");
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState<Donation | null>(null);
  useEffect(() => {
    fetch("/backend-api/admin/donations", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        const rows = (await response.json()) as Array<{
          id: string;
          provider: string;
          providerReference: string;
          donorName?: string;
          donorEmail?: string;
          donorPhone?: string;
          amountCents: number;
          currency?: string;
          frequency: string;
          designation?: string;
          createdAt: string;
          status: string;
          receiptUrl?: string;
        }>;
        setDonations(
          rows
            .filter((row) => row.status === "Succeeded")
            .map((row) => ({
              id: row.providerReference || row.id,
              provider: row.provider,
              donor: row.donorName || "Anonymous donor",
              email: row.donorEmail || "Not provided",
              phone: row.donorPhone,
              amount: row.amountCents / 100,
              currency: row.currency?.toUpperCase() || "USD",
              frequency: row.frequency === "Monthly" ? "Monthly" : "One-time",
              designation: row.designation || "Where needed most",
              date: row.createdAt,
              receiptUrl: row.receiptUrl,
            })),
        );
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);
  const filtered = useMemo(() => {
    const rows = donations.filter((donation) => {
      const text =
        `${donation.donor} ${donation.email} ${donation.id} ${donation.designation} ${donation.provider}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
    return rows.sort((a, b) => {
      if (sort === "Amount high") return b.amount - a.amount;
      if (sort === "Amount low") return a.amount - b.amount;
      const dates = new Date(b.date).getTime() - new Date(a.date).getTime();
      return sort === "Oldest" ? -dates : dates;
    });
  }, [donations, query, sort]);
  const succeeded = donations;
  const total = succeeded.reduce((sum, donation) => sum + donation.amount, 0);
  const now = new Date();
  const thisMonth = succeeded.filter((donation) => {
    const date = new Date(donation.date);
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });
  const thisMonthTotal = thisMonth.reduce(
    (sum, donation) => sum + donation.amount,
    0,
  );
  const monthly = succeeded.filter(
    (donation) => donation.frequency === "Monthly",
  );
  const monthlyThisMonth = thisMonth.filter(
    (donation) => donation.frequency === "Monthly",
  );
  const uniqueMonthlyDonors = new Set(
    monthly.map((donation) =>
      donation.email !== "Not provided"
        ? donation.email.toLowerCase()
        : donation.donor.toLowerCase(),
    ),
  ).size;
  const exportCsv = () => {
    const rows = [
      [
        "Reference",
        "Provider",
        "Donor",
        "Email",
        "Phone",
        "Amount",
        "Currency",
        "Frequency",
        "Designation",
        "Date",
      ],
      ...filtered.map((d) => [
        d.id,
        d.provider,
        d.donor,
        d.email,
        d.phone || "",
        d.amount.toFixed(2),
        d.currency,
        d.frequency,
        d.designation,
        d.date,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = `sharehope-donations-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  return (
    <div className="bg-[#F5F6F4] p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <section className="flex flex-col justify-between gap-5 rounded-3xl bg-brand-navy p-7 text-white lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#FFC72C]">
              Giving operations
            </p>
            <h1 className="mt-3 font-serif text-4xl font-bold">Donations</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              Review gifts, recurring support, designations, receipts, and
              payment status from one place.
            </p>
          </div>
          <button
            type="button"
            onClick={exportCsv}
            disabled={!filtered.length}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            <Download size={17} />
            Export CSV
          </button>
        </section>

        {loading && (
          <div className="rounded-2xl border bg-white p-5 text-sm text-slate-500">
            Loading verified donations…
          </div>
        )}
        {loadError && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
          >
            Donations could not be loaded. Check the backend connection and
            refresh this page.
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total received",
              value: formatMoney(total, "USD"),
              detail: "Verified successful gifts",
              icon: CircleDollarSign,
            },
            {
              label: "This month",
              value: formatMoney(thisMonthTotal, "USD"),
              detail: `${thisMonth.length} successful donation${thisMonth.length === 1 ? "" : "s"}`,
              icon: CalendarDays,
            },
            {
              label: "Monthly gifts received",
              value: formatMoney(
                monthlyThisMonth.reduce(
                  (sum, donation) => sum + donation.amount,
                  0,
                ),
                "USD",
              ),
              detail: "Recurring gifts received this month",
              icon: RefreshCcw,
            },
            {
              label: "Monthly donors",
              value: uniqueMonthlyDonors,
              detail: "Unique recurring supporters on record",
              icon: UsersRound,
            },
          ].map(({ label, value, detail, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <span className="grid size-9 place-items-center rounded-xl bg-[#FFF4CC]">
                  <Icon className="text-[#9A6A00]" size={19} />
                </span>
              </div>
              <p className="mt-3 text-3xl font-bold text-brand-navy">{value}</p>
              <p className="mt-1 text-xs text-slate-400">{detail}</p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-200 p-5">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="font-bold text-brand-navy">Donation activity</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Search completed gifts by donor, email, reference, or
                  designation.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="relative min-w-64 flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search donations"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10"
                  />
                </label>
                <FilterSelect
                  value={sort}
                  onChange={(value) => setSort(value as SortOption)}
                  label="Sort"
                >
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>Amount high</option>
                  <option>Amount low</option>
                </FilterSelect>
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold text-brand-navy hover:bg-slate-100"
                  >
                    <X size={14} /> Clear search
                  </button>
                )}
              </div>
            </div>
          </header>

          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-5 py-3 text-xs text-slate-500">
            <span>
              <strong className="text-brand-navy">{filtered.length}</strong> of{" "}
              {donations.length} transactions
            </span>
            <span>Showing verified provider records</span>
          </div>

          {filtered.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] text-left">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Donor</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Frequency</th>
                    <th className="px-4 py-3">Designation</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Reference</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((donation) => (
                    <tr key={donation.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-brand-navy">
                          {donation.donor}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {donation.anonymous
                            ? "Hidden publicly"
                            : donation.email}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-brand-navy">
                        {formatMoney(donation.amount, donation.currency)}{" "}
                        <span className="text-[10px] text-slate-400">
                          {donation.currency}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {donation.frequency}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                          <HeartHandshake
                            size={14}
                            className="text-[#B77900]"
                          />
                          {donation.designation}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(new Date(donation.date))}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-xs font-bold capitalize text-slate-600">
                          {donation.provider}
                        </p>
                        <p
                          className="mt-1 max-w-32 truncate font-mono text-[10px] text-slate-400"
                          title={donation.id}
                        >
                          {donation.id}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelected(donation)}
                          title="View donation details"
                          className="rounded-lg border border-slate-200 p-2 text-brand-navy"
                        >
                          <MoreHorizontal size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-14 text-center">
              <CircleDollarSign className="mx-auto text-slate-300" size={40} />
              <h3 className="mt-4 font-bold text-brand-navy">
                No donations to display
              </h3>
              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
                Connected, verified donations will appear here with payment
                status and receipt information.
              </p>
            </div>
          )}
        </section>
        {selected && (
          <div
            className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
          >
            <section className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-blue-700">
                    {selected.provider}
                  </p>
                  <h2 className="font-serif text-2xl font-bold text-brand-navy">
                    Donation details
                  </h2>
                </div>
                <button onClick={() => setSelected(null)} aria-label="Close">
                  ✕
                </button>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-slate-500">Donor</dt>
                  <dd className="font-bold">{selected.donor}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Amount</dt>
                  <dd className="font-bold">
                    {formatMoney(selected.amount, selected.currency)}{" "}
                    {selected.currency}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Email</dt>
                  <dd>{selected.email}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Phone</dt>
                  <dd>{selected.phone || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Designation</dt>
                  <dd>{selected.designation}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Reference</dt>
                  <dd className="break-all font-mono text-xs">{selected.id}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Frequency</dt>
                  <dd>{selected.frequency}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Date</dt>
                  <dd>
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(selected.date))}
                  </dd>
                </div>
              </dl>
              {selected.receiptUrl && (
                <a
                  href={selected.receiptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-lg bg-brand-navy px-5 py-3 text-sm font-bold text-white"
                >
                  View provider receipt <ExternalLink size={15} />
                </a>
              )}
            </section>
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="font-bold text-brand-navy">Payment records</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Stripe and PayPal transactions appear after their verified payment
              notifications arrive.
            </p>
            <span className="mt-4 inline-block text-xs font-bold uppercase tracking-wider text-slate-400">
              Provider verified
            </span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="font-bold text-brand-navy">Receipts</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Donors receive a branded confirmation, and provider receipt links
              appear in transaction details when available.
            </p>
            <span className="mt-4 inline-block text-xs font-bold uppercase tracking-wider text-slate-400">
              Sent automatically
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
