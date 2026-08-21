import { customers, getCustomerById } from "@/data/customers";
import type { Customer } from "@/types/customer";
import type { Paginated, PaginationParams } from "@/types/service";
import { ServiceError } from "@/types/service";
import { sleep } from "@/lib/utils";

export interface CustomerQuery extends PaginationParams {
  search?: string;
  riskLevel?: Customer["riskLevel"];
}

export interface CustomerService {
  list(query: CustomerQuery): Promise<Paginated<Customer>>;
  getById(id: string): Promise<Customer | null>;
  getByPhone(phone: string): Promise<Customer | null>;
}

function paginate<T>(list: T[], { page = 1, pageSize = 10 }: PaginationParams): Paginated<T> {
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return { items: list.slice(start, start + pageSize), page: safePage, pageSize, total, totalPages };
}

export const mockCustomerService: CustomerService = {
  async list(query) {
    await sleep(300);
    let result = [...customers].sort((a, b) => b.totalSpent - a.totalSpent);
    if (query.riskLevel) result = result.filter((c) => c.riskLevel === query.riskLevel);
    if (query.search) {
      const term = query.search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(term) || c.phone.includes(term));
    }
    return paginate(result, query);
  },

  async getById(id) {
    await sleep(250);
    return getCustomerById(id) ?? null;
  },

  async getByPhone(phone) {
    await sleep(250);
    return customers.find((c) => c.phone === phone) ?? null;
  },
};

export const customerService: CustomerService = mockCustomerService;
