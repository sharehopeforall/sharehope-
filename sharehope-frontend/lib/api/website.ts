import { apiClient } from "@/lib/api/client";
import type {
  Homepage,
  HomepageSectionUpdateInput,
  HomepageSectionResponse,
  TranslateContentResponse,
  UpdateHomepageSectionInput,
  ManagedSitePageKey,
  VisualPageContentResponse,
  VisualPatchMap,
} from "@/types/website";

export const websiteApi = {
  getPublicHomepage: (locale: string) =>
    apiClient.get<Homepage>(`/public/website/homepage?locale=${locale}`, { auth: false }),

  getAdminHomepage: (locale: string) =>
    apiClient.get<Homepage>(`/admin/website/homepage?locale=${locale}`),

  updateHomepageSection: (sectionKey: string, data: UpdateHomepageSectionInput) =>
    apiClient.put<HomepageSectionResponse>(
      `/admin/website/homepage/sections/${sectionKey}`,
      data,
    ),

  updateHomepage: (sections: HomepageSectionUpdateInput[]) =>
    apiClient.put<Homepage>("/admin/website/homepage", { sections }),

  getAdminPage: (pageKey: ManagedSitePageKey, locale: string) =>
    apiClient.get<Homepage>(`/admin/website/pages/${pageKey}?locale=${locale}`),

  getPublicPage: (pageKey: ManagedSitePageKey, locale: string) =>
    apiClient.get<Homepage>(`/public/website/pages/${pageKey}?locale=${locale}`, { auth: false }),

  updatePage: (pageKey: ManagedSitePageKey, data: UpdateHomepageSectionInput) =>
    apiClient.put<HomepageSectionResponse>(`/admin/website/pages/${pageKey}`, data),

  getVisualContent: (path: string, locale: string) =>
    apiClient.get<VisualPageContentResponse>(`/admin/website/visual-content?path=${encodeURIComponent(path)}&locale=${locale}`),
  saveVisualDraft: (path: string, locale: string, content: VisualPatchMap) =>
    apiClient.put<VisualPageContentResponse>(`/admin/website/visual-content/draft?path=${encodeURIComponent(path)}&locale=${locale}`, { content }),
  publishVisualContent: (path: string, locale: string) =>
    apiClient.post<VisualPageContentResponse>(`/admin/website/visual-content/publish?path=${encodeURIComponent(path)}&locale=${locale}`),
  discardVisualDraft: (path: string, locale: string) =>
    apiClient.post<VisualPageContentResponse>(`/admin/website/visual-content/discard?path=${encodeURIComponent(path)}&locale=${locale}`),

  translateToFrench: (fields: Record<string, string>) =>
    apiClient.post<TranslateContentResponse>("/admin/website/translate", { fields }),

};
