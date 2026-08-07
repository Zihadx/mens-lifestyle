import { customers } from "@/data/customers";
import { staffUsers } from "@/data/users";
import type { SessionUser, UserRole } from "@/store/slices/session-slice";
import { ServiceError } from "@/types/service";
import { sleep } from "@/lib/utils";

export interface LoginInput {
  phone: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  phone: string;
  password: string;
}

export interface AuthService {
  login(input: LoginInput): Promise<SessionUser>;
  register(input: RegisterInput): Promise<SessionUser>;
  requestOtp(phone: string): Promise<{ sent: boolean }>;
  verifyOtp(phone: string, code: string): Promise<SessionUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<SessionUser | null>;
}

function toSessionUser(id: string, name: string, phone: string, role: UserRole, email?: string): SessionUser {
  return { id, name, phone, email, role };
}

export const mockAuthService: AuthService = {
  async login({ phone }) {
    await sleep(500);
    const staff = staffUsers.find((u) => u.phone === phone);
    if (staff) return toSessionUser(staff.id, staff.name, staff.phone, staff.role, staff.email);

    const customer = customers.find((c) => c.phone === phone);
    if (customer) return toSessionUser(customer.id, customer.name, customer.phone, "customer", customer.email);

    throw new ServiceError("No account found with this phone number.", "not-found");
  },

  async register({ name, phone }) {
    await sleep(500);
    return toSessionUser(`cust_new_${Date.now()}`, name, phone, "customer");
  },

  async requestOtp() {
    await sleep(400);
    return { sent: true };
  },

  async verifyOtp(phone, code) {
    await sleep(400);
    if (code.length !== 6) throw new ServiceError("Enter the 6-digit code sent to your phone.", "validation");
    const existing = customers.find((c) => c.phone === phone);
    return existing
      ? toSessionUser(existing.id, existing.name, existing.phone, "customer", existing.email)
      : toSessionUser(`cust_new_${Date.now()}`, "New Customer", phone, "customer");
  },

  async logout() {
    await sleep(200);
  },

  async getCurrentUser() {
    await sleep(150);
    return null; // no persisted session in the frontend-only preview
  },
};

export const authService: AuthService = mockAuthService;
