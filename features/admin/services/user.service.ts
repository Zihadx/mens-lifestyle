import { staffUsers as seedUsers, type StaffUser } from "@/data/users";
import type { UserRole } from "@/store/slices/session-slice";
import { ServiceError } from "@/types/service";
import { sleep } from "@/lib/utils";

export type InviteUserInput = { name: string; phone: string; email: string; role: UserRole };

export interface UserService {
  list(): Promise<StaffUser[]>;
  invite(input: InviteUserInput): Promise<StaffUser>;
  setActive(id: string, isActive: boolean): Promise<StaffUser>;
  setRole(id: string, role: UserRole): Promise<StaffUser>;
}

const userStore: StaffUser[] = [...seedUsers];

export const mockUserService: UserService = {
  async list() {
    await sleep(250);
    return userStore;
  },
  async invite(input) {
    await sleep(400);
    const user: StaffUser = { ...input, id: `usr_${Date.now()}`, isActive: true, lastActiveAt: new Date().toISOString() };
    userStore.push(user);
    return user;
  },
  async setActive(id, isActive) {
    await sleep(250);
    const user = userStore.find((u) => u.id === id);
    if (!user) throw new ServiceError(`User ${id} not found`, "not-found");
    user.isActive = isActive;
    return user;
  },
  async setRole(id, role) {
    await sleep(250);
    const user = userStore.find((u) => u.id === id);
    if (!user) throw new ServiceError(`User ${id} not found`, "not-found");
    user.role = role;
    return user;
  },
};

export const userService: UserService = mockUserService;
