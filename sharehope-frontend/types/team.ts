export type TeamMemberStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "FORMER";

export interface TeamMember {
  id: string;
  fullName: string;
  jobTitle: string;
  department: string | null;
  startDate: string | null;
  status: TeamMemberStatus;
  workEmail: string | null;
  phone: string | null;
  location: string | null;
  managerName: string | null;
  notes: string | null;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TeamMemberInput = Omit<TeamMember, "id" | "createdAt" | "updatedAt">;
