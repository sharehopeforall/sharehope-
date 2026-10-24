"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { VisualMissionEditor } from "@/components/admin/forms/VisualMissionEditor";
import { VisualWhyShareHopeEditor } from "@/components/admin/forms/VisualWhyShareHopeEditor";
import { VisualManagedSectionEditor } from "@/components/admin/forms/VisualManagedSectionEditor";
import { VisualHeroEditor } from "@/components/admin/forms/VisualHeroEditor";
import { useAdminHomepage, useUpdateHomepage, useUpdateHomepageSection } from "@/hooks/useHomepage";
import { HOMEPAGE_DIRTY_EVENT, saveHomepageEditors } from "@/hooks/useHomepageSaveEvent";
import type { HomepageSectionUpdateInput, UpdateHomepageSectionInput } from "@/types/website";

export default function AdminHomepagePage() {
  const t = useTranslations("Admin");
  const tEditor = useTranslations("HomepageEditor");
  const locale = useLocale();
  const { sections, isLoading, isError } = useAdminHomepage();
  const { mutateAsync, isPending, variables, isSuccess, isError: isSaveError } = useUpdateHomepageSection();
  const { mutateAsync: updateHomepage } = useUpdateHomepage();
  const [lastSavedKey, setLastSavedKey] = useState<string | null>(null);
  const editorLocale: "en" | "fr" = locale === "fr" ? "fr" : "en";
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [saveAllError, setSaveAllError] = useState(false);
  const batchRef = useRef<HomepageSectionUpdateInput[] | null>(null);

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

  const handleSave = (sectionKey: string) => async (data: UpdateHomepageSectionInput) => {
    setLastSavedKey(null);
    if (batchRef.current) {
      batchRef.current.push({ sectionKey, data });
      return;
    }
    try {
      await mutateAsync({ sectionKey, data });
      setLastSavedKey(sectionKey);
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
    } catch {
      setSaveAllError(true);
      setHasUnsavedChanges(true);
    } finally {
      batchRef.current = null;
      setIsSavingAll(false);
    }
  };

  return (
    <>
      <AdminHeader title={t("homepage")} />
      <div className="flex flex-col gap-0">
        {isLoading && (
          <p className="text-sm text-muted-foreground">{tEditor("loading")}</p>
        )}
        {isError && <p className="text-sm text-destructive">{tEditor("loadError")}</p>}

        {sections
          .filter((section) => section.key === "hero")
          .map((section) => (
            <VisualHeroEditor
                key={JSON.stringify(section)}
                section={section}
                locale={editorLocale}
                onSave={handleSave(section.key)}
                isSaving={isPending && variables?.sectionKey === section.key}
              />
          ))}

        {sections
          .filter((section) => section.key === "impact")
          .map((section) => (
            <VisualWhyShareHopeEditor
              key={JSON.stringify(section)}
              section={section}
              onSave={handleSave(section.key)}
              isSaving={isPending && variables?.sectionKey === section.key}
              justSaved={isSuccess && lastSavedKey === section.key}
              saveError={isSaveError && variables?.sectionKey === section.key}
              locale={editorLocale}
            />
          ))}
        {sections
          .filter((section) => section.key === "mission")
          .map((section) => (
            <VisualMissionEditor
              key={JSON.stringify(section)}
              section={section}
              onSave={handleSave(section.key)}
              isSaving={isPending && variables?.sectionKey === section.key}
              justSaved={isSuccess && lastSavedKey === section.key}
              saveError={isSaveError && variables?.sectionKey === section.key}
              locale={editorLocale}
            />
          ))}
        {(["need", "programs", "newsletter"] as const).map((sectionKey) => {
          const section = sections.find((item) => item.key === sectionKey);
          if (!section) return null;
          return (
            <VisualManagedSectionEditor
              key={JSON.stringify(section)}
              section={section}
              sectionKey={sectionKey}
              locale={editorLocale}
              onSave={handleSave(section.key)}
              isSaving={isPending && variables?.sectionKey === section.key}
              justSaved={isSuccess && lastSavedKey === section.key}
              saveError={isSaveError && variables?.sectionKey === section.key}
            />
          );
        })}
        {(hasUnsavedChanges || isPending || isSavingAll) && (
          <div className="fixed bottom-0 left-0 right-0 z-[100] flex animate-in flex-wrap items-center gap-4 border-t border-[#DDD8CF] bg-[#FFFEFB]/98 px-6 py-4 shadow-[0_-8px_30px_rgba(11,30,52,0.08)] backdrop-blur duration-200 slide-in-from-bottom-4 md:left-64 md:px-10">
            <span className="text-sm font-medium text-[#716D67]">
              {isSavingAll || isPending ? "Saving changes..." : "Unsaved changes"}
            </span>
            {(saveAllError || isSaveError) && !isPending && <span className="text-sm font-semibold text-destructive">Some changes could not be saved</span>}
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
