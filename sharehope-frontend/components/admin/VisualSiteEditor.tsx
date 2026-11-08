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

type VisualSelection = { selector: string; type: VisualPatch["type"]; value: string; href?: string; tag: string };
type PreviewMessage = { source: "sharehope-preview"; session?: string; action: "ready" | "patch" | "select" | "navigate"; patch?: VisualPatch; path?: string; selection?: VisualSelection };
const widths = { desktop: "100%", tablet: "820px", mobile: "390px" } as const;

export function VisualSiteEditor() {
  const iframe = useRef<HTMLIFrameElement>(null);
  const loadVersion = useRef(0);
  const versionRef = useRef(0);
  const identityRef = useRef("en:/");
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
  const [selection, setSelection] = useState<VisualSelection | null>(null);
  const [inspectorValue, setInspectorValue] = useState("");
  const isPublisher = user?.role === "SUPER_ADMIN";
  const dirty = useMemo(() => JSON.stringify(patches) !== JSON.stringify(saved), [patches, saved]);
  const previewSession = `${locale}:${path}`;
  const frameUrl = `/${locale}${path === "/" ? "" : path}?visualEditor=1&visualEditorSession=${encodeURIComponent(previewSession)}`;

  useEffect(() => { identityRef.current = previewSession; }, [previewSession]);

  const send = useCallback((message: object) => iframe.current?.contentWindow?.postMessage({ source: "sharehope-editor", session: previewSession, ...message }, window.location.origin), [previewSession]);
  const load = useCallback(async () => {
    const version = ++loadVersion.current;
    setLoading(true); setStatus("Loading draft…");
    try {
      const result = await websiteApi.getVisualContent(path, locale);
      if (version !== loadVersion.current) return;
      const content = Object.keys(result.draftContent).length ? result.draftContent : result.publishedContent;
      versionRef.current = result.version;
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
      if (event.origin !== window.location.origin || event.source !== iframe.current?.contentWindow || event.data?.source !== "sharehope-preview" || event.data.session !== previewSession) return;
      if (event.data.action === "ready") send({ action: "hydrate", patches: patchesRef.current });
      if (event.data.action === "patch" && event.data.patch) {
        const patch = event.data.patch;
        const next = { ...patchesRef.current, [`${patch.selector}::${patch.type}`]: patch };
        patchesRef.current = next;
        setPatches(next);
        setStatus("Unsaved changes");
        send({ action: "apply", patch });
      }
      if (event.data.action === "select" && event.data.selection) {
        setSelection(event.data.selection);
        setInspectorValue(event.data.selection.type === "background" ? event.data.selection.value : event.data.selection.href ?? "");
      }
      if (event.data.action === "navigate" && event.data.path) {
        if (!dirty || window.confirm("Discard unsaved changes and open another page?")) {
          setPath(event.data.path);
          setCustomPath("");
          setSelection(null);
        }
      }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [dirty, previewSession, send]);

  useEffect(() => {
    if (!dirty) return;
    const warning = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warning);
    return () => window.removeEventListener("beforeunload", warning);
  }, [dirty]);

  const saveDraft = async () => {
    const identity = previewSession;
    setSaving(true);
    setStatus("Translating English and French…");
    try {
      const result = await websiteApi.saveVisualDraft(path, locale, patchesRef.current, versionRef.current);
      if (identityRef.current !== identity) return false;
      versionRef.current = result.version;
      patchesRef.current = result.draftContent;
      setPatches(result.draftContent);
      setSaved(result.draftContent);
      setStatus(result.translationSucceeded === false
        ? "Draft saved, but automatic translation failed — check Render logs"
        : "Draft saved and translated automatically");
      return true;
    } catch (error) {
      if (identityRef.current === identity) {
        const conflict = error instanceof Error && "status" in error && (error as { status?: number }).status === 409;
        setStatus(conflict ? "Another editor changed this page — reload before saving" : "Draft save failed — nothing was published");
      }
      return false;
    } finally {
      setSaving(false);
    }
  };
  const publish = async () => {
    if (dirty && !(await saveDraft())) return;
    setPublishing(true);
    setStatus("Publishing English and French…");
    try {
      const result = await websiteApi.publishVisualContent(path, locale, versionRef.current);
      versionRef.current = result.version;
      patchesRef.current = result.publishedContent;
      setPatches(result.publishedContent);
      setSaved(result.publishedContent);
      send({ action: "hydrate", patches: result.publishedContent });
      setStatus("English and French published successfully");
    } catch {
      setStatus(isPublisher ? "Publish failed" : "Only a super admin can publish");
    } finally {
      setPublishing(false);
    }
  };
  const discard = async () => {
    if (!window.confirm("Discard this draft and restore the published page?")) return;
    setSaving(true);
    try {
      const identity = previewSession;
      const result = await websiteApi.discardVisualDraft(path, locale, versionRef.current);
      if (identityRef.current !== identity) return;
      versionRef.current = result.version;
      patchesRef.current = result.draftContent;
      setPatches(result.draftContent);
      setSaved(result.draftContent);
      iframe.current?.contentWindow?.location.reload();
      setStatus("Draft discarded in English and French");
    } catch {
      setStatus("Draft could not be discarded");
    } finally {
      setSaving(false);
    }
  };

  const changeLocation = (nextPath: string, nextLocale = locale) => {
    if (dirty && !window.confirm("Discard unsaved changes and switch pages?")) return;
    setPath(nextPath);
    setLocale(nextLocale);
    setCustomPath("");
    setSelection(null);
  };

  const applyInspectorChange = () => {
    if (!selection) return;
    const type: VisualPatch["type"] = selection.type === "background" ? "background" : "link";
    const value = inspectorValue.trim();
    const safe = type === "link"
      ? /^(https:\/\/|\/|#|mailto:|tel:)/.test(value)
      : /^(https:\/\/|\/)/.test(value);
    if (value && !safe) {
      setStatus("Use a secure https:// address or an internal /page path");
      return;
    }
    const patch: VisualPatch = { selector: selection.selector, type, value };
    const next = { ...patchesRef.current, [`${patch.selector}::${patch.type}`]: patch };
    patchesRef.current = next;
    setPatches(next);
    send({ action: "apply", patch });
    setStatus("Unsaved changes");
  };

  return <div className="flex h-full min-h-0 flex-col bg-[#E9EDF1]">
    <div className="flex flex-wrap items-center gap-3 border-b bg-white px-4 py-3">
      <select value={path} disabled={saving || publishing} onChange={(event) => changeLocation(event.target.value)} className="rounded-lg border px-3 py-2 text-sm font-semibold">{pages.map(([value, label]) => <option key={value} value={value}>{label}</option>)}<option value={customPath || "/custom"}>Custom page…</option></select>
      <input aria-label="Custom page path" value={customPath} disabled={saving || publishing} onChange={(event) => setCustomPath(event.target.value)} onBlur={() => { if (customPath.startsWith("/")) changeLocation(customPath.replace(/\/$/, "") || "/"); }} placeholder="New page path, e.g. /campaign" className="w-56 rounded-lg border px-3 py-2 text-sm" />
      <div className="flex rounded-lg border bg-slate-50 p-1">{(["en", "fr"] as const).map((item) => <button key={item} disabled={saving || publishing} aria-pressed={locale === item} onClick={() => changeLocation(path, item)} className={`rounded-md px-3 py-1.5 text-xs font-black uppercase ${locale === item ? "bg-brand-navy text-white" : "text-slate-500"}`}>{item}</button>)}</div>
      <div className="flex rounded-lg border bg-slate-50 p-1">{(["desktop", "tablet", "mobile"] as const).map((item) => { const Icon = item === "desktop" ? Monitor : item === "tablet" ? Tablet : Smartphone; return <button key={item} aria-label={`${item} preview`} aria-pressed={viewport === item} title={`${item} preview`} onClick={() => setViewport(item)} className={`rounded-md p-2 ${viewport === item ? "bg-white text-brand-navy shadow" : "text-slate-400"}`}><Icon size={16} /></button>; })}</div>
      <span aria-live="polite" className="min-w-0 flex-1 truncate text-xs text-slate-500">{status}</span>
      <button onClick={discard} disabled={loading || saving} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-40"><RotateCcw size={15} /> Discard</button>
      <button onClick={saveDraft} disabled={!dirty || saving || publishing} className="inline-flex items-center gap-2 rounded-lg border border-brand-navy px-3 py-2 text-sm font-semibold text-brand-navy disabled:opacity-40">{saving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />} Save draft</button>
      <button onClick={publish} disabled={!isPublisher || publishing || saving} title={isPublisher ? "Publish this page" : "Only super admins can publish"} className="inline-flex items-center gap-2 rounded-lg bg-brand-navy px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{publishing ? <Loader2 className="animate-spin" size={15} /> : <Send size={15} />} Publish</button>
      <a href={`/${locale}${path === "/" ? "" : path}`} target="_blank" rel="noopener noreferrer" aria-label="Open live page" className="rounded-lg border p-2 text-brand-navy" title="Open live page"><ExternalLink size={16} /></a>
    </div>

    {selection && (selection.tag === "a" || selection.type === "background") && (
      <div className="flex flex-wrap items-center gap-3 border-b bg-white px-4 py-3">
        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
          {selection.type === "background" ? "Background image URL" : "Link destination"}
        </label>
        <input value={inspectorValue} onChange={(event) => setInspectorValue(event.target.value)} className="min-w-72 flex-1 rounded-lg border px-3 py-2 text-sm" placeholder={selection.type === "background" ? "https://…" : "/donate or https://…"} />
        <button type="button" onClick={applyInspectorChange} className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-bold text-white">Apply</button>
        <button type="button" onClick={() => setSelection(null)} className="rounded-lg border px-3 py-2 text-sm font-semibold">Close</button>
      </div>
    )}

    <div className="flex min-h-0 flex-1 justify-center overflow-auto p-5">
        <div style={{ width: widths[viewport] }} className="h-full min-h-[620px] max-w-full overflow-hidden rounded-lg bg-white shadow-2xl transition-[width] duration-300">
          <iframe
            key={frameUrl}
            ref={iframe}
            title={`${path} visual editor`}
            src={frameUrl}
            onLoad={() => send({ action: "hydrate", patches: patchesRef.current })}
            className="h-full w-full border-0"
            scrolling="yes"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        </div>
    </div>
  </div>;
}
