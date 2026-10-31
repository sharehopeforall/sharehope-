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
    [busy, setBusy] = useState(false);
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
                    readOnly
                    className="w-full font-bold text-brand-navy"
                  />
                  <p className="mt-1 text-sm text-slate-500">{item.altText}</p>
                  <button
                    onClick={() => remove(item.id)}
                    className="mt-4 text-sm font-bold text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
