/**
 * Shared contracts for the service layer. Every domain service (product,
 * order, customer, ...) returns these shapes so components never care
 * whether the data came from mock fixtures or a real API.
 */

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export type SortDirection = "asc" | "desc";

/**
 * Thrown by mock services to simulate realistic failure modes
 * (not-found, validation, simulated network error) so UI error states
 * are exercised even without a real backend.
 */
export class ServiceError extends Error {
  code: "not-found" | "validation" | "network" | "unknown";
  constructor(message: string, code: ServiceError["code"] = "unknown") {
    super(message);
    this.name = "ServiceError";
    this.code = code;
  }
}
