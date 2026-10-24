"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { VisualEducationEditor } from "@/components/admin/forms/VisualEducationEditor";
import { useAdminHomepage, useUpdateHomepage, useUpdateHomepageSection } from "@/hooks/useHomepage";
import type { MergedHomepageSection } from "@/hooks/useHomepage";
import { HOMEPAGE_DIRTY_EVENT, saveHomepageEditors } from "@/hooks/useHomepageSaveEvent";
import type { HomepageSectionUpdateInput, UpdateHomepageSectionInput } from "@/types/website";

const EDUCATION_CACHE_KEY = "sharehope:education-content";

const FALLBACK_SECTION: MergedHomepageSection = {
  key: "education",
  type: "PROGRAMS",
  displayOrder: 10,
  enabled: true,
  settings: {},
  en: { title: null, subtitle: null, body: null, buttonText: null },
  fr: { title: null, subtitle: null, body: null, buttonText: null },
};

export default function AdminEducationPage() {
  const t = useTranslations("Admin");
  const tEditor = useTranslations("HomepageEditor");
  const locale = useLocale();
  const { sections, isLoading, isError } = useAdminHomepage();
  const { mutateAsync, isPending } = useUpdateHomepageSection();
  const { mutateAsync: updateHomepage } = useUpdateHomepage();
  const editorLocale: "en" | "fr" = locale === "fr" ? "fr" : "en";
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [saveAllError, setSaveAllError] = useState(false);
  const batchRef = useRef<HomepageSectionUpdateInput[] | null>(null);

  const section = sections.find((item) => item.key === "education") ?? FALLBACK_SECTION;

  useEffect(() => {
    const markDirty = () => setHasUnsavedChanges(true);
    window.addEventListener(HOMEPAGE_DIRTY_EVENT, markDirty);
    return () => window.removeEventListener(HOMEPAGE_DIRTY_EVENT, markDirty);
  }, []);

  useEffect(() => {
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSave = async (data: UpdateHomepageSectionInput) => {
    if (batchRef.current) {
      batchRef.current.push({ sectionKey: "education", data });
      return;
    }
    try {
      await mutateAsync({ sectionKey: "education", data });
    } catch (error) {
      setHasUnsavedChanges(true);
      throw error;
    }
  };

  const saveAll = async () => {
    setIsSavingAll(true);
    setSaveAllError(false);
    batchRef.current = [];
    try {
      await saveHomepageEditors();
      await updateHomepage(batchRef.current);
      setHasUnsavedChanges(false);
      localStorage.removeItem(EDUCATION_CACHE_KEY);
    } catch {
      // The backend does not yet expose an "education" section — keep the
      // edits in localStorage so the public page can pick them up.
      const batched = batchRef.current?.find((item) => item.sectionKey === "education");
      if (batched?.data.settings) {
        try {
          localStorage.setItem(EDUCATION_CACHE_KEY, JSON.stringify(batched.data.settings));
          setHasUnsavedChanges(false);
        } catch {
          setSaveAllError(true);
          setHasUnsavedChanges(true);
        }
      } else {
        setSaveAllError(true);
        setHasUnsavedChanges(true);
      }
    } finally {
      batchRef.current = null;
      setIsSavingAll(false);
    }
  };

  return (
    <>
      <AdminHeader title={t("education")} />
      <div className="flex flex-col gap-0">
        {isLoading && (
          <p className="text-sm text-muted-foreground">{tEditor("loading")}</p>
        )}
        {isError && !isLoading && (
          <p className="mb-4 rounded-md border border-[#E5E0D8] bg-[#FFF8E1] px-4 py-3 text-sm text-[#6B5D2F]">
            The CMS could not be reached — you are editing the built-in defaults. Changes will be saved to the education section when the backend accepts them.
          </p>
        )}
        <VisualEducationEditor
          key={JSON.stringify(section)}
          section={section}
          locale={editorLocale}
          onSave={handleSave}
          isSaving={isPending}
        />
        {(hasUnsavedChanges || isPending || isSavingAll) && (
          <div className="fixed bottom-0 left-0 right-0 z-[100] flex animate-in flex-wrap items-center gap-4 border-t border-[#DDD8CF] bg-[#FFFEFB]/98 px-6 py-4 shadow-[0_-8px_30px_rgba(11,30,52,0.08)] backdrop-blur duration-200 slide-in-from-bottom-4 md:left-64 md:px-10">
            <span className="text-sm font-medium text-[#716D67]">
              {isSavingAll || isPending ? "Saving changes..." : "Unsaved changes"}
            </span>
            {saveAllError && !isPending && <span className="text-sm font-semibold text-destructive">Some changes could not be saved</span>}
            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                disabled={isPending || isSavingAll}
                onClick={() => window.location.reload()}
                className="rounded-xl border border-[#D8D3CC] bg-white px-6 py-3 text-sm font-bold text-[#29233D] transition hover:bg-[#F7F4EE] disabled:opacity-50"
              >
                Discard changes
              </button>
              <button
                type="button"
                disabled={isPending || isSavingAll || isLoading}
                onClick={() => void saveAll()}
                className="rounded-xl bg-[#A98549] px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#92723E] disabled:cursor-wait disabled:opacity-60"
              >
                {isPending || isSavingAll ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
