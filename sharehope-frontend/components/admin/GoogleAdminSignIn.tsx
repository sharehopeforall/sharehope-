"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useRouter } from "@/i18n/navigation";
import { useGoogleLogin } from "@/hooks/useAuth";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (element: HTMLElement, options: Record<string, string | number>) => void;
        };
      };
    };
  }
}

export function GoogleAdminSignIn() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
  const button = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { mutate, isPending, error } = useGoogleLogin();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded || !clientId || !button.current || !window.google) return;
    const target = button.current;
    target.replaceChildren();
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: ({ credential }) => {
        mutate(credential, {
          onSuccess: () => router.replace("/admin/dashboard"),
        });
      },
    });
    window.google.accounts.id.renderButton(target, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "pill",
      logo_alignment: "left",
      width: Math.min(400, Math.max(240, target.clientWidth || 400)),
    });
  }, [clientId, loaded, mutate, router]);

  return (
    <div>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={() => setLoaded(true)} />
      {clientId ? (
        <div ref={button} className={`flex min-h-11 w-full justify-center ${isPending ? "pointer-events-none opacity-60" : ""}`} />
      ) : (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Google sign-in is awaiting configuration.</p>
      )}
      {error && (
        <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          This Google account is not an authorized ShareHope administrator.
        </p>
      )}
    </div>
  );
}
