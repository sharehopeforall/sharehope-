"use client";
import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getAccessToken } from "@/lib/auth/token";
import { Download } from "lucide-react";
type S = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  locale: string;
  subscribedAt: string;
};
export default function Page() {
  const [rows, setRows] = useState<S[]>([]);
  useEffect(() => {
    fetch("/backend-api/admin/newsletter/subscribers", {
      headers: { Authorization: `Bearer ${getAccessToken() ?? ""}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then(setRows);
  }, []);
  function csv() {
    const data = [
      ["First name", "Last name", "Email", "Locale", "Subscribed"],
      ...rows.map((s) => [
        s.firstName || "",
        s.lastName || "",
        s.email,
        s.locale,
        s.subscribedAt,
      ]),
    ];
    const value = data
      .map((row) =>
        row.map((x) => `"${String(x).replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([value], { type: "text/csv" }));
    a.download = `sharehope-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  return (
    <>
      <AdminHeader title="Newsletter" />
      <main className="p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex justify-end">
            <button
              onClick={csv}
              disabled={!rows.length}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-navy px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4">Subscriber</th>
                  <th className="p-4">Locale</th>
                  <th className="p-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td className="p-4">
                      <b>
                        {s.firstName} {s.lastName}
                      </b>
                      <div className="text-slate-500">{s.email}</div>
                    </td>
                    <td className="p-4 uppercase">{s.locale}</td>
                    <td className="p-4">
                      {new Date(s.subscribedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!rows.length && (
              <p className="p-10 text-center text-slate-500">
                No subscribers yet.
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
