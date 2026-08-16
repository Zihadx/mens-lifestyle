export type UserRole = "admin" | "staff" | "moderator";

export type StaffStatus = "active" | "inactive" | "suspended";

export interface StaffUser {
  id: string;

  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;

  role: UserRole;
  status: StaffStatus;

  department: string | null;
  designation: string | null;

  emailVerified: boolean;
  phoneVerified: boolean;

  joinedAt: string;
  lastActiveAt: string | null;
}