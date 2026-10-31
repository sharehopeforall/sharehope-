"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getAccessToken } from "@/lib/auth/token";
import { uploadFile } from "@/lib/blob/upload";
type Item = {
  id: string;
  imageUrl: string;
  title: string;
  altText: string;
  displayOrder: number;
  published: boolean;
};
const auth = () => ({ Authorization: `Bearer ${getAccessToken() ?? ""}` });
export default function Page() {
  const [items, setItems] = useState<Item[]>([]),
    [busy, setBusy] = useState(false),
    [savingId, setSavingId] = useState<string | null>(null),
    [message, setMessage] = useState("");
  const load = () =>
    fetch("/backend-api/admin/gallery", { headers: auth() })
      .then((r) => r.json())
      .then(setItems);
  useEffect(() => {
    void load();
  }, []);
  async function add(file: File) {
    setBusy(true);
    try {
      const media = await uploadFile(file);
      await fetch("/backend-api/admin/gallery", {
        method: "POST",
        headers: { ...auth(), "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: media.url,
          title: file.name.replace(/\.[^.]+$/, "").replaceAll("-", " "),
          altText: "ShareHope community photo",
          displayOrder: items.length,
          published: true,
        }),
      });
      await load();
    } finally {
      setBusy(false);
    }
  }
  async function remove(id: string) {
    if (!confirm("Remove this gallery image?")) return;
    await fetch(`/backend-api/admin/gallery/${id}`, {
      method: "DELETE",
      headers: auth(),
    });
    setItems((v) => v.filter((i) => i.id !== id));
  }
  function change(id: string, changes: Partial<Item>) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
  }
  async function save(item: Item) {
    setSavingId(item.id);
    setMessage("");
    try {
      const response = await fetch(`/backend-api/admin/gallery/${item.id}`, {
        method: "PUT",
        headers: { ...auth(), "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error();
      const saved = (await response.json()) as Item;
      change(item.id, saved);
      setMessage(`Saved “${saved.title}”.`);
      await load();
    } catch {
      setMessage("The gallery item could not be saved. Please try again.");
    } finally {
      setSavingId(null);
    }
  }
  return (
    <>
      <AdminHeader title="Gallery" />
      <main className="bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <label className="mb-8 flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed bg-white p-8 font-bold text-brand-navy">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={busy}
              onChange={(e) => e.target.files?.[0] && add(e.target.files[0])}
            />
            {busy ? "Uploading…" : "Upload gallery image"}
          </label>
          {message && (
            <p role="status" className="mb-5 rounded-xl bg-white p-3 text-sm text-slate-600">
              {message}
            </p>
          )}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.imageUrl}
                    alt={item.altText}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <input
                    aria-label="Title"
                    value={item.title}
                    onChange={(event) =>
                      change(item.id, { title: event.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 font-bold text-brand-navy"
                  />
                  <textarea
                    aria-label="Alternative text"
                    value={item.altText}
                    onChange={(event) =>
                      change(item.id, { altText: event.target.value })
                    }
                    placeholder="Describe the image for visitors using screen readers"
                    className="mt-3 min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
                  />
                  <div className="mt-3 flex items-center gap-3">
                    <label className="flex-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Display order
                      <input
                        type="number"
                        min="0"
                        value={item.displayOrder}
                        onChange={(event) =>
                          change(item.id, {
                            displayOrder: Number(event.target.value),
                          })
                        }
                        className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                      />
                    </label>
                    <label className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-600">
                      <input
                        type="checkbox"
                        checked={item.published}
                        onChange={(event) =>
                          change(item.id, { published: event.target.checked })
                        }
                      />
                      Published
                    </label>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <button
                      onClick={() => save(item)}
                      disabled={savingId === item.id || !item.title.trim() || !item.altText.trim()}
                      className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                    >
                      {savingId === item.id ? "Saving…" : "Save changes"}
                    </button>
                    <button
                      onClick={() => remove(item.id)}
                      className="text-sm font-bold text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
