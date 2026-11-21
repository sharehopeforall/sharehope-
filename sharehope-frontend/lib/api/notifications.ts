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
  list: () => apiClient.get<NotificationFeed>("/api/admin/notifications"),
  read: (id: string) => apiClient.patch<AdminNotification>(`/api/admin/notifications/${id}/read`),
  readAll: () => apiClient.post<void>("/api/admin/notifications/read-all"),
};
