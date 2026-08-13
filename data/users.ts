import type { UserRole } from "@/store/slices/session-slice";

export interface StaffUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  lastActiveAt: string;
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export const staffUsers: StaffUser[] = [
  { id: "usr_0001", name: "Nusrat Jahan", phone: "01711-000001", email: "nusrat@vero-store.example.com", role: "admin", isActive: true, lastActiveAt: daysAgo(0.01) },
  { id: "usr_0002", name: "Kamrul Hasan", phone: "01711-000002", email: "kamrul@vero-store.example.com", role: "staff", isActive: true, lastActiveAt: daysAgo(0.1) },
  { id: "usr_0003", name: "Sabrina Akter", phone: "01711-000003", email: "sabrina@vero-store.example.com", role: "staff", isActive: true, lastActiveAt: daysAgo(0.5) },
  { id: "usr_0004", name: "Tariqul Islam", phone: "01711-000004", email: "tariq@vero-store.example.com", role: "moderator", isActive: true, lastActiveAt: daysAgo(1) },
  { id: "usr_0005", name: "Farhana Yasmin", phone: "01711-000005", email: "farhana@vero-store.example.com", role: "admin", isActive: false, lastActiveAt: daysAgo(40) },
];

/** Mock "logged in as" user for the frontend preview — swap for real session in Milestone 14. */
export const currentMockUser: StaffUser = staffUsers[0]!;
