"use client";

import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { websiteApi } from "@/lib/api/website";
import type { ManagedSitePageKey, UpdateHomepageSectionInput } from "@/types/website";

export function useAdminSitePage(pageKey: ManagedSitePageKey) {
  const [en, fr] = useQueries({
    queries: [
      { queryKey: ["admin-site-page", pageKey, "en"], queryFn: () => websiteApi.getAdminPage(pageKey, "en") },
      { queryKey: ["admin-site-page", pageKey, "fr"], queryFn: () => websiteApi.getAdminPage(pageKey, "fr") },
    ],
  });
  return {
    en: en.data?.sections[0],
    fr: fr.data?.sections[0],
    isLoading: en.isLoading || fr.isLoading,
    isError: en.isError || fr.isError,
  };
}

export function useUpdateSitePage(pageKey: ManagedSitePageKey) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateHomepageSectionInput) => websiteApi.updatePage(pageKey, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["admin-site-page", pageKey] });
      client.invalidateQueries({ queryKey: ["public-site-page", pageKey] });
    },
  });
}
