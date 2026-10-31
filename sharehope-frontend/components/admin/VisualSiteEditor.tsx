"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Loader2, Monitor, RotateCcw, Save, Send, Smartphone, Tablet } from "lucide-react";
import { websiteApi } from "@/lib/api/website";
import { useCurrentUser } from "@/hooks/useAuth";
import type { VisualPatch, VisualPatchMap } from "@/types/website";

const pages = [
  ["/", "Homepage"], ["/about", "About"], ["/about/our-story", "Our Story"], ["/about/founder", "Founder"], ["/about/team", "Team"],
  ["/programs", "Programs"], ["/programs/education", "Education"], ["/health", "Health"], ["/community", "Community"], ["/events", "Events"], ["/blog", "Blog"],
  ["/donate", "Donate"], ["/volunteer", "Volunteer"], ["/partner", "Partner"], ["/get-involved", "Get Involved"], ["/contact", "Contact"], ["/privacy", "Privacy"],
] as const;

type PreviewMessage = { source: "sharehope-preview"; session?: string; action: "ready" | "patch" | "select" | "navigate"; patch?: VisualPatch; path?: string };
const widths = { desktop: "100%", tablet: "820px", mobile: "390px" } as const;

export function VisualSiteEditor() {
  const iframe = useRef<HTMLIFrameElement>(null);
  const loadVersion = useRef(0);
  const user = useCurrentUser().data;
  const [path, setPath] = useState("/");
  const [customPath, setCustomPath] = useState("");
  const [locale, setLocale] = useState<"en" | "fr">("en");
  const [viewport, setViewport] = useState<keyof typeof widths>("desktop");
  const [patches, setPatches] = useState<VisualPatchMap>({});
  const patchesRef = useRef<VisualPatchMap>({});
  const [saved, setSaved] = useState<VisualPatchMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [status, setStatus] = useState("Loading draft…");
  const isPublisher = user?.role === "SUPER_ADMIN";
  const dirty = useMemo(() => JSON.stringify(patches) !== JSON.stringify(saved), [patches, saved]);
  const previewSession = `${locale}:${path}`;
  const frameUrl = `/${locale}${path === "/" ? "" : path}?visualEditor=1&visualEditorSession=${encodeURIComponent(previewSession)}`;

  const send = useCallback((message: object) => iframe.current?.contentWindow?.postMessage({ source: "sharehope-editor", session: previewSession, ...message }, window.location.origin), [previewSession]);
  const load = useCallback(async () => {
    const version = ++loadVersion.current;
    setLoading(true); setStatus("Loading draft…");
    try {
      const result = await websiteApi.getVisualContent(path, locale);
      if (version !== loadVersion.current) return;
      const content = Object.keys(result.draftContent).length ? result.draftContent : result.publishedContent;
      patchesRef.current = content;
      setPatches(content); setSaved(content); setStatus(result.publishedAt ? `Published ${new Date(result.publishedAt).toLocaleString()}` : "Not published yet");
      send({ action: "hydrate", patches: content });
    } catch { if (version === loadVersion.current) setStatus("Draft could not be loaded"); }
    finally { if (version === loadVersion.current) setLoading(false); }
  }, [locale, path, send]);
  useEffect(() => {
    // The selected route and locale identify a different persisted draft.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  useEffect(() => {
    const receive = (event: MessageEvent<PreviewMessage>) => {
      if (event.origin !== window.location.origin || event.data?.source !== "sharehope-preview" || event.data.session !== previewSession) return;
      if (event.data.action === "ready") send({ action: "hydrate", patches: patchesRef.current });
      if (event.data.action === "patch" && event.data.patch) {
        const patch = event.data.patch;
        const next = { ...patchesRef.current, [`${patch.selector}::${patch.type}`]: patch };
        patchesRef.current = next;
        setPatches(next);
        send({ action: "apply", patch });
      }
      if (event.data.action === "navigate" && event.data.path) {
        setPath(event.data.path);
        setCustomPath("");
      }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [previewSession, send]);

  useEffect(() => {
    if (!dirty) return;
    const warning = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warning);
    return () => window.removeEventListener("beforeunload", warning);
  }, [dirty]);

  const saveDraft = async () => {
    setSaving(true);
    try {
      const result = await websiteApi.saveVisualDraft(path, locale, patchesRef.current);
      patchesRef.current = result.draftContent;
      setPatches(result.draftContent);
      setSaved(result.draftContent);
      setStatus("Draft saved");
      return true;
    } catch {
      setStatus("Draft save failed — nothing was published");
      return false;
    } finally {
      setSaving(false);
    }
  };
  const publish = async () => {
    if (dirty && !(await saveDraft())) return;
    setPublishing(true);
    try {
      const result = await websiteApi.publishVisualContent(path, locale);
      patchesRef.current = result.publishedContent;
      setPatches(result.publishedContent);
      setSaved(result.publishedContent);
      send({ action: "hydrate", patches: result.publishedContent });
      setStatus("Published successfully");
    } catch {
      setStatus(isPublisher ? "Publish failed" : "Only a super admin can publish");
    } finally {
      setPublishing(false);
    }
  };
  const discard = async () => {
    if (!window.confirm("Discard this draft and restore the published page?")) return;
    const result = await websiteApi.discardVisualDraft(path, locale);
    patchesRef.current = result.draftContent;
    setPatches(result.draftContent);
    setSaved(result.draftContent);
    iframe.current?.contentWindow?.location.reload();
    setStatus("Draft discarded");
  };

  return <div className="flex h-full min-h-0 flex-col bg-[#E9EDF1]">
    <div className="flex flex-wrap items-center gap-3 border-b bg-white px-4 py-3">
      <select value={path} onChange={(event) => { setPath(event.target.value); setCustomPath(""); }} className="rounded-lg border px-3 py-2 text-sm font-semibold">{pages.map(([value, label]) => <option key={value} value={value}>{label}</option>)}<option value={customPath || "/custom"}>Custom page…</option></select>
      <input value={customPath} onChange={(event) => setCustomPath(event.target.value)} onBlur={() => { if (customPath.startsWith("/")) setPath(customPath.replace(/\/$/, "") || "/"); }} placeholder="New page path, e.g. /campaign" className="w-56 rounded-lg border px-3 py-2 text-sm" />
      <div className="flex rounded-lg border bg-slate-50 p-1">{(["en", "fr"] as const).map((item) => <button key={item} onClick={() => setLocale(item)} className={`rounded-md px-3 py-1.5 text-xs font-black uppercase ${locale === item ? "bg-brand-navy text-white" : "text-slate-500"}`}>{item}</button>)}</div>
      <div className="flex rounded-lg border bg-slate-50 p-1">{(["desktop", "tablet", "mobile"] as const).map((item) => { const Icon = item === "desktop" ? Monitor : item === "tablet" ? Tablet : Smartphone; return <button key={item} title={`${item} preview`} onClick={() => setViewport(item)} className={`rounded-md p-2 ${viewport === item ? "bg-white text-brand-navy shadow" : "text-slate-400"}`}><Icon size={16} /></button>; })}</div>
      <span className="min-w-0 flex-1 truncate text-xs text-slate-500">{dirty ? "Unsaved changes" : status}</span>
      <button onClick={discard} disabled={loading || saving} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-40"><RotateCcw size={15} /> Discard</button>
      <button onClick={saveDraft} disabled={!dirty || saving} className="inline-flex items-center gap-2 rounded-lg border border-brand-navy px-3 py-2 text-sm font-semibold text-brand-navy disabled:opacity-40">{saving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />} Save draft</button>
      <button onClick={publish} disabled={!isPublisher || publishing} title={isPublisher ? "Publish this page" : "Only super admins can publish"} className="inline-flex items-center gap-2 rounded-lg bg-brand-navy px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{publishing ? <Loader2 className="animate-spin" size={15} /> : <Send size={15} />} Publish</button>
      <a href={`/${locale}${path === "/" ? "" : path}`} target="_blank" className="rounded-lg border p-2 text-brand-navy" title="Open live page"><ExternalLink size={16} /></a>
    </div>

    <div className="flex min-h-0 flex-1 justify-center overflow-auto p-5">
        <div style={{ width: widths[viewport] }} className="h-full min-h-[620px] max-w-full overflow-hidden rounded-lg bg-white shadow-2xl transition-[width] duration-300">
          <iframe
            key={frameUrl}
            ref={iframe}
            title={`${path} visual editor`}
            src={frameUrl}
            onLoad={() => send({ action: "hydrate", patches: patchesRef.current })}
            className="h-full w-full border-0"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        </div>
    </div>
  </div>;
}
