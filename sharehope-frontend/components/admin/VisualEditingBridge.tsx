"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { uploadFile } from "@/lib/blob/upload";
import type { VisualPatch, VisualPatchMap, VisualPatchType } from "@/types/website";

type EditorMessage =
  | { source: "sharehope-editor"; session?: string; action: "hydrate"; patches: VisualPatchMap }
  | { source: "sharehope-editor"; session?: string; action: "apply"; patch: VisualPatch };

function selectorFor(element: Element, root: Element): string {
  const visualKey = element.getAttribute("data-visual-key");
  if (visualKey) return `[data-visual-key="${visualKey.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"]`;
  if (element.id) return `#${CSS.escape(element.id)}`;
  const parts: string[] = [];
  let current: Element | null = element;
  while (current && current !== root) {
    const tag = current.tagName.toLowerCase();
    const siblings = current.parentElement ? [...current.parentElement.children].filter((item) => item.tagName === current?.tagName) : [];
    parts.unshift(`${tag}:nth-of-type(${Math.max(1, siblings.indexOf(current) + 1)})`);
    current = current.parentElement;
  }
  return `#visual-page-root > ${parts.join(" > ")}`;
}

function applyPatch(patch: VisualPatch) {
  let element: HTMLElement | null = null;
  try { element = document.querySelector<HTMLElement>(patch.selector); } catch { return; }
  if (!element) return;
  if (patch.type === "image" && element instanceof HTMLImageElement && element.dataset.visualKey && !patch.selector.startsWith("[data-visual-key=")) return;
  if (patch.type === "text" && element.textContent !== patch.value) {
    element.textContent = patch.value;
  }
  if (patch.type === "image" && element instanceof HTMLImageElement) {
    if (element.getAttribute("src") !== patch.value || element.srcset) {
      element.srcset = "";
      element.src = patch.value;
    }
  }
  if (patch.type === "video" && element instanceof HTMLVideoElement) {
    if (element.getAttribute("src") !== patch.value) {
      element.src = patch.value;
      element.load();
    }
    const placeholder = element.parentElement?.querySelector<HTMLElement>("[data-video-placeholder]");
    if (placeholder) placeholder.hidden = Boolean(patch.value);
  }
  if (patch.type === "link" && element instanceof HTMLAnchorElement && element.getAttribute("href") !== patch.value) {
    element.setAttribute("href", patch.value);
  }
  if (patch.type === "background") {
    const nextBackground = patch.value ? `url("${patch.value.replaceAll('"', "")}")` : "none";
    if (element.style.backgroundImage !== nextBackground) element.style.backgroundImage = nextBackground;
  }
}

function applyAll(patches: VisualPatchMap) { Object.values(patches).forEach(applyPatch); }

export function VisualEditingBridge() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("#visual-page-root");
    if (!root) return;
    const content = root.querySelector<HTMLElement>("[data-visual-editor-content]") ?? root;
    const params = new URLSearchParams(window.location.search);
    const editing = params.get("visualEditor") === "1";
    const session = params.get("visualEditorSession") ?? "";
    const locale = pathname.split("/")[1] === "fr" ? "fr" : "en";
    const pagePath = `/${pathname.split("/").slice(2).join("/")}`.replace(/\/$/, "") || "/";
    const cleanups: (() => void)[] = [];

    if (!editing) {
      let publishedPatches: VisualPatchMap = {};
      fetch(`/backend-api/public/website/visual-content?path=${encodeURIComponent(pagePath)}&locale=${locale}`)
        .then((response) => response.ok ? response.json() as Promise<VisualPatchMap> : {})
        .then((patches) => { publishedPatches = patches; applyAll(patches); })
        .catch(() => undefined);
      let patchFrame: number | null = null;
      const publicObserver = new MutationObserver(() => {
        if (patchFrame !== null) return;
        patchFrame = requestAnimationFrame(() => {
          patchFrame = null;
          applyAll(publishedPatches);
        });
      });
      publicObserver.observe(content, { childList: true, subtree: true });
      return () => {
        publicObserver.disconnect();
        if (patchFrame !== null) cancelAnimationFrame(patchFrame);
      };
    }

    document.documentElement.dataset.visualEditing = "true";
    let activePatches: VisualPatchMap = {};
    const editableSelector = "h1,h2,h3,h4,h5,h6,p,li,figcaption,a,span,img,[style*='background-image']";
    const interactiveSelector = "button,[role='button'],[data-visual-editor-lock],input,select,textarea";
    const mark = () => {
      applyAll(activePatches);
      content.querySelectorAll<HTMLElement>(editableSelector).forEach((element) => {
        if (element.closest("[data-visual-editor-ignore]") || element.closest(interactiveSelector)) return;
        element.dataset.visualEditable = "true";
      });
      content.querySelectorAll<HTMLImageElement>("img[data-visual-editable='true']").forEach((image) => {
        const parent = image.parentElement;
        if (!parent) return;
        const isTeamPhotoPlaceholder = (image.getAttribute("src") ?? image.currentSrc).includes("team-photo-placeholder");
        const imageActionLabel = isTeamPhotoPlaceholder ? "Add picture" : "Change picture";
        const hoverHost = parent.classList.contains("absolute") && parent.parentElement
          ? parent.parentElement
          : parent;
        const targetSelector = selectorFor(image, root);
        const existingButton = [...parent.children].find(
          (child): child is HTMLButtonElement =>
            child instanceof HTMLButtonElement && child.dataset.visualImageButton === "true",
        );
        if (existingButton) {
          hoverHost.dataset.visualMediaControl = "true";
          image.dataset.visualImageControl = "true";
          existingButton.dataset.visualTarget = targetSelector;
          if (existingButton.textContent !== imageActionLabel) existingButton.textContent = imageActionLabel;
          existingButton.setAttribute("aria-label", `${imageActionLabel}${image.alt ? `: ${image.alt}` : ""}`);
          return;
        }
        hoverHost.dataset.visualMediaControl = "true";
        image.dataset.visualImageControl = "true";
        if (getComputedStyle(parent).position === "static") {
          parent.dataset.visualPreviousPosition = parent.style.position;
          parent.style.position = "relative";
        }
        const changeButton = document.createElement("button");
        changeButton.type = "button";
        changeButton.dataset.visualEditorLock = "true";
        changeButton.dataset.visualImageButton = "true";
        changeButton.dataset.visualTarget = targetSelector;
        changeButton.textContent = imageActionLabel;
        changeButton.setAttribute("aria-label", `${imageActionLabel}${image.alt ? `: ${image.alt}` : ""}`);
        changeButton.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          const picker = document.createElement("input");
          picker.type = "file";
          picker.accept = "image/*";
          picker.hidden = true;
          picker.addEventListener("change", async () => {
            const file = picker.files?.[0];
            if (!file) { picker.remove(); return; }
            changeButton.disabled = true;
            changeButton.textContent = "Uploading…";
            try {
              const result = await uploadFile(file);
              const selector = changeButton.dataset.visualTarget ?? targetSelector;
              const currentImage = document.querySelector<HTMLImageElement>(selector);
              if (!currentImage) throw new Error("The picture is no longer available.");
              const patch: VisualPatch = { selector, type: "image", value: result.url };
              activePatches[`${patch.selector}::${patch.type}`] = patch;
              applyPatch(patch);
              window.parent.postMessage({ source: "sharehope-preview", session, action: "patch", patch }, window.location.origin);
              changeButton.textContent = "Picture changed";
              window.setTimeout(() => { changeButton.textContent = "Change picture"; }, 1400);
            } catch {
              changeButton.textContent = "Upload failed — try again";
            } finally {
              changeButton.disabled = false;
              picker.remove();
            }
          }, { once: true });
          document.body.appendChild(picker);
          picker.click();
        });
        parent.appendChild(changeButton);
      });
      content.querySelectorAll<HTMLVideoElement>("video[data-visual-key]").forEach((video) => {
        const parent = video.parentElement;
        if (!parent) return;
        const hoverHost = parent.classList.contains("absolute") && parent.parentElement
          ? parent.parentElement
          : parent;
        const targetSelector = selectorFor(video, root);
        const existingButton = [...parent.children].find(
          (child): child is HTMLButtonElement =>
            child instanceof HTMLButtonElement && child.dataset.visualVideoButton === "true",
        );
        if (existingButton) {
          hoverHost.dataset.visualMediaControl = "true";
          video.dataset.visualVideoControl = "true";
          existingButton.dataset.visualTarget = targetSelector;
          return;
        }
        hoverHost.dataset.visualMediaControl = "true";
        video.dataset.visualVideoControl = "true";
        if (getComputedStyle(parent).position === "static") {
          parent.dataset.visualPreviousPosition = parent.style.position;
          parent.style.position = "relative";
        }
        const uploadButton = document.createElement("button");
        uploadButton.type = "button";
        uploadButton.dataset.visualEditorLock = "true";
        uploadButton.dataset.visualVideoButton = "true";
        uploadButton.dataset.visualTarget = targetSelector;
        uploadButton.textContent = video.currentSrc ? "Change video" : "Upload video";
        uploadButton.setAttribute("aria-label", video.currentSrc ? "Change ministry video" : "Upload ministry video");
        uploadButton.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          const picker = document.createElement("input");
          picker.type = "file";
          picker.accept = "video/mp4,video/webm,video/quicktime";
          picker.hidden = true;
          picker.addEventListener("change", async () => {
            const file = picker.files?.[0];
            if (!file) { picker.remove(); return; }
            uploadButton.disabled = true;
            uploadButton.textContent = "Uploading video…";
            try {
              const result = await uploadFile(file);
              const selector = uploadButton.dataset.visualTarget ?? targetSelector;
              const currentVideo = document.querySelector<HTMLVideoElement>(selector);
              if (!currentVideo) throw new Error("The video is no longer available.");
              const patch: VisualPatch = { selector, type: "video", value: result.url };
              activePatches[`${patch.selector}::${patch.type}`] = patch;
              applyPatch(patch);
              window.parent.postMessage({ source: "sharehope-preview", session, action: "patch", patch }, window.location.origin);
              uploadButton.textContent = "Video uploaded";
              window.setTimeout(() => { uploadButton.textContent = "Change video"; }, 1400);
            } catch (error) {
              uploadButton.textContent = error instanceof Error ? error.message : "Upload failed — try again";
            } finally {
              uploadButton.disabled = false;
              picker.remove();
            }
          }, { once: true });
          document.body.appendChild(picker);
          picker.click();
        });
        parent.appendChild(uploadButton);
      });
    };
    mark();
    const observer = new MutationObserver(mark);
    observer.observe(content, { childList: true, subtree: true });
    cleanups.push(() => observer.disconnect());

    const select = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>(editableSelector);
      if (!target || !content.contains(target) || target.closest("[data-visual-editor-ignore]") || target.closest(interactiveSelector)) return;
      event.preventDefault(); event.stopPropagation();
      root.querySelectorAll("[data-visual-selected]").forEach((item) => item.removeAttribute("data-visual-selected"));
      target.dataset.visualSelected = "true";
      const selector = selectorFor(target, root);
      const isImage = target instanceof HTMLImageElement;
      const background = !isImage && getComputedStyle(target).backgroundImage !== "none";
      const type: VisualPatchType = isImage ? "image" : background && event.altKey ? "background" : "text";
      const value = isImage ? target.currentSrc || target.src : type === "background" ? getComputedStyle(target).backgroundImage.replace(/^url\(["']?|["']?\)$/g, "") : target.textContent ?? "";
      window.parent.postMessage({ source: "sharehope-preview", session, action: "select", selection: { selector, type, value, href: target instanceof HTMLAnchorElement ? target.getAttribute("href") ?? "" : "", tag: target.tagName.toLowerCase() } }, window.location.origin);
      if (type === "text") { target.contentEditable = "true"; target.focus(); }
    };
    const input = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.contentEditable !== "true") return;
      const patch: VisualPatch = { selector: selectorFor(target, root), type: "text", value: target.textContent ?? "" };
      window.parent.postMessage({ source: "sharehope-preview", session, action: "patch", patch }, window.location.origin);
    };
    const keydown = (event: KeyboardEvent) => { if (event.key === "Escape" && document.activeElement instanceof HTMLElement) document.activeElement.blur(); };
    const navigateFromLockedLink = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-visual-editor-ignore],[data-visual-editor-lock]")) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      event.preventDefault();
      event.stopPropagation();
      const segments = destination.pathname.split("/").filter(Boolean);
      const nextPath = `/${segments.slice(segments[0] === "en" || segments[0] === "fr" ? 1 : 0).join("/")}`.replace(/\/$/, "") || "/";
      window.parent.postMessage({ source: "sharehope-preview", session, action: "navigate", path: nextPath }, window.location.origin);
    };
    root.addEventListener("click", navigateFromLockedLink, true);
    content.addEventListener("click", select, true); content.addEventListener("input", input, true); document.addEventListener("keydown", keydown);
    cleanups.push(() => { root.removeEventListener("click", navigateFromLockedLink, true); content.removeEventListener("click", select, true); content.removeEventListener("input", input, true); document.removeEventListener("keydown", keydown); });

    const receive = (event: MessageEvent<EditorMessage>) => {
      if (event.origin !== window.location.origin || event.data?.source !== "sharehope-editor" || (event.data.session ?? "") !== session) return;
      if (event.data.action === "hydrate") { activePatches = event.data.patches; applyAll(activePatches); }
      if (event.data.action === "apply") { activePatches[`${event.data.patch.selector}::${event.data.patch.type}`] = event.data.patch; applyPatch(event.data.patch); }
    };
    window.addEventListener("message", receive);
    cleanups.push(() => window.removeEventListener("message", receive));
    window.parent.postMessage({ source: "sharehope-preview", session, action: "ready" }, window.location.origin);
    return () => {
      delete document.documentElement.dataset.visualEditing;
      content.querySelectorAll("[data-visual-image-button]").forEach((button) => button.remove());
      content.querySelectorAll("[data-visual-video-button]").forEach((button) => button.remove());
      content.querySelectorAll<HTMLElement>("[data-visual-previous-position]").forEach((element) => {
        element.style.position = element.dataset.visualPreviousPosition ?? "";
        delete element.dataset.visualPreviousPosition;
      });
      content.querySelectorAll<HTMLElement>("[data-visual-image-control]").forEach((element) => delete element.dataset.visualImageControl);
      content.querySelectorAll<HTMLElement>("[data-visual-video-control]").forEach((element) => delete element.dataset.visualVideoControl);
      content.querySelectorAll<HTMLElement>("[data-visual-media-control]").forEach((element) => delete element.dataset.visualMediaControl);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [pathname]);

  return <style>{`
    html[data-visual-editing="true"] [data-visual-editable="true"] { cursor: pointer; }
    html[data-visual-editing="true"] [data-visual-editable="true"]:hover { outline: 2px dashed #f05a24; outline-offset: 3px; }
    html[data-visual-editing="true"] [data-visual-selected="true"] { outline: 3px solid #ff5917 !important; outline-offset: 3px; }
    html[data-visual-editing="true"] [contenteditable="true"] { cursor: text; }
    html[data-visual-editing="true"] [data-visual-image-button="true"],
    html[data-visual-editing="true"] [data-visual-video-button="true"] {
      position: absolute; z-index: 40; top: 12px; right: 12px; display: inline-flex; align-items: center;
      border: 1px solid rgba(255,255,255,.8); border-radius: 8px; background: rgba(11,39,70,.92);
      padding: 9px 12px; color: white; font: 700 12px/1.1 ui-sans-serif, system-ui, sans-serif;
      box-shadow: 0 6px 18px rgba(0,0,0,.2); cursor: pointer; white-space: nowrap;
      transition: background-color .16s ease;
    }
    html[data-visual-editing="true"] [data-visual-image-button="true"]:hover,
    html[data-visual-editing="true"] [data-visual-video-button="true"]:hover { background: #f05a24; }
    html[data-visual-editing="true"] [data-visual-image-button="true"]:disabled,
    html[data-visual-editing="true"] [data-visual-video-button="true"]:disabled { cursor: wait; }
  `}</style>;
}
