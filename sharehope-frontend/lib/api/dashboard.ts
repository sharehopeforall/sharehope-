import {apiClient} from "./client";

export type DashboardRegistration = {
  id: string;
  fullName: string;
  registrationType: "RSVP" | "VOLUNTEER";
  status: "PENDING_CONFIRMATION" | "CONFIRMED" | "CHECKED_IN" | "CANCELLED";
  eventTitle: string;
  createdAt: string;
};

export type OwnerDashboardSummary = {
  donationTotalCents: number;
  successfulDonations: number;
  activeMonthlyDonors: number;
  newApplications: number;
  newsletterSubscribers: number;
  upcomingVolunteers: number;
  recentRegistrations: DashboardRegistration[];
  generatedAt: string;
};

export const dashboardApi = {
  summary: () => apiClient.get<OwnerDashboardSummary>("/admin/dashboard"),
};
