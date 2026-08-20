import { createClient } from "@/lib/supabase/client";

import type { Customer } from "@/types/customer";
import type {
  Paginated,
  PaginationParams,
} from "@/types/service";

import { ServiceError } from "@/types/service";

export interface CustomerQuery
  extends PaginationParams {
  search?: string;
  riskLevel?: Customer["riskLevel"];
}

export interface CustomerService {
  list(
    query: CustomerQuery,
  ): Promise<Paginated<Customer>>;

  getById(
    id: string,
  ): Promise<Customer | null>;

  getByUserId(
    userId: string,
  ): Promise<Customer | null>;

  getByPhone(
    phone: string,
  ): Promise<Customer | null>;
}

function paginate<T>(
  list: T[],
  {
    page = 1,
    pageSize = 10,
  }: PaginationParams,
): Paginated<T> {
  const total = list.length;

  const totalPages = Math.max(
    1,
    Math.ceil(total / pageSize),
  );

  const safePage = Math.min(
    Math.max(1, page),
    totalPages,
  );

  const start =
    (safePage - 1) * pageSize;

  return {
    items: list.slice(
      start,
      start + pageSize,
    ),
    page: safePage,
    pageSize,
    total,
    totalPages,
  };
}

export const customerService: CustomerService = {
  // ============================================
  // Get current user by Supabase Auth ID
  // ============================================

  async getByUserId(userId) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error(
        "Get user profile error:",
        error,
      );

      throw new ServiceError(
        "Failed to load user profile.",
      );
    }

    return data as Customer | null;
  },

  // ============================================
  // Get user by ID
  // ============================================

  async getById(id) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(
        "Get user error:",
        error,
      );

      throw new ServiceError(
        "Failed to load user.",
      );
    }

    return data as Customer | null;
  },

  // ============================================
  // Get user by phone
  // ============================================

  async getByPhone(phone) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("phone", phone)
      .maybeSingle();

    if (error) {
      console.error(
        "Get user by phone error:",
        error,
      );

      throw new ServiceError(
        "Failed to find user.",
      );
    }

    return data as Customer | null;
  },

  // ============================================
  // List users
  // ============================================

  async list(query) {
    const supabase = await createClient();

    let request = supabase
      .from("user_profiles")
      .select("*", {
        count: "exact",
      });

    if (query.search) {
      const search =
        query.search.trim();

      request = request.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`,
      );
    }

    const page = query.page ?? 1;
    const pageSize =
      query.pageSize ?? 10;

    const from =
      (page - 1) * pageSize;

    const to =
      from + pageSize - 1;

    const {
      data,
      error,
      count,
    } = await request
      .range(from, to)
      .order("joined_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "List users error:",
        error,
      );

      throw new ServiceError(
        "Failed to load users.",
      );
    }

    const total = count ?? 0;

    return {
      items: (data ?? []) as Customer[],
      page,
      pageSize,
      total,
      totalPages: Math.max(
        1,
        Math.ceil(
          total / pageSize,
        ),
      ),
    };
  },
};