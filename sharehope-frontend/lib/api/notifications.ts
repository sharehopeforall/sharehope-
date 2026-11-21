import {apiClient} from "./client";

export type AdminNotification = {
  id: string;
  type: string;
  severity: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  title: string;
  message: string;
  actionUrl?: string | null;
  createdAt: string;
  readAt?: string | null;
};

export type NotificationFeed = {items: AdminNotification[]; unreadCount: number};

export const notificationApi = {
  list: () => apiClient.get<NotificationFeed>("/admin/notifications"),
  read: (id: string) => apiClient.patch<AdminNotification>(`/admin/notifications/${id}/read`),
  readAll: () => apiClient.post<void>("/admin/notifications/read-all"),
};
