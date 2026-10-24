"use client";

import { useMemo } from "react";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { websiteApi } from "@/lib/api/website";
import type { HomepageSectionUpdateInput, SectionType, UpdateHomepageSectionInput } from "@/types/website";

export interface SectionTranslation {
  title: string | null;
  subtitle: string | null;
  body: string | null;
  buttonText: string | null;
}

export interface MergedHomepageSection {
  key: string;
  type: SectionType;
  displayOrder: number;
  enabled: boolean;
  settings: Record<string, unknown>;
  en: SectionTranslation;
  fr: SectionTranslation;
}

const EMPTY_TRANSLATION: SectionTranslation = {
  title: null,
  subtitle: null,
  body: null,
  buttonText: null,
};

/** Public homepage for a single locale - used by a future public site preview. */
export function usePublicHomepage(locale: string) {
  return useQuery({
    queryKey: ["public-homepage", locale],
    queryFn: () => websiteApi.getPublicHomepage(locale),
  });
}

/**
 * The admin GET endpoint returns section content for one locale at a time.
 * The editor needs English and French side by side, so this fetches both
 * locales in parallel and merges them into one list of sections, each
 * carrying its own `en` and `fr` translation.
 */
export function useAdminHomepage() {
  const [enQuery, frQuery] = useQueries({
    queries: [
      { queryKey: ["admin-homepage", "en"], queryFn: () => websiteApi.getAdminHomepage("en") },
      { queryKey: ["admin-homepage", "fr"], queryFn: () => websiteApi.getAdminHomepage("fr") },
    ],
  });

  const sections = useMemo<MergedHomepageSection[]>(() => {
    if (!enQuery.data) return [];

    const frByKey = new Map((frQuery.data?.sections ?? []).map((section) => [section.key, section]));

    return [...enQuery.data.sections]
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((enSection) => {
        const frSection = frByKey.get(enSection.key);

        return {
          key: enSection.key,
          type: enSection.type,
          displayOrder: enSection.displayOrder,
          enabled: enSection.enabled,
          settings: enSection.settings,
          en: {
            title: enSection.title,
            subtitle: enSection.subtitle,
            body: enSection.body,
            buttonText: enSection.buttonText,
          },
          fr: frSection
            ? {
                title: frSection.title,
                subtitle: frSection.subtitle,
                body: frSection.body,
                buttonText: frSection.buttonText,
              }
            : EMPTY_TRANSLATION,
        };
      });
  }, [enQuery.data, frQuery.data]);

  return {
    sections,
    isLoading: enQuery.isLoading,
    isError: enQuery.isError || frQuery.isError,
  };
}

export function useUpdateHomepageSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sectionKey,
      data,
    }: {
      sectionKey: string;
      data: UpdateHomepageSectionInput;
    }) => websiteApi.updateHomepageSection(sectionKey, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-homepage"] });
      queryClient.invalidateQueries({ queryKey: ["public-homepage"] });
    },
  });
}

export function useUpdateHomepage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sections: HomepageSectionUpdateInput[]) => websiteApi.updateHomepage(sections),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-homepage"] });
      queryClient.invalidateQueries({ queryKey: ["public-homepage"] });
    },
  });
}
