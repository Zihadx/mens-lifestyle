/**
 * Centralized query keys so cache invalidation is consistent across the app.
 * e.g. after placing an order: queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
 */
export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: (query: unknown) => ["products", "list", query] as const,
    detail: (slug: string) => ["products", "detail", slug] as const,
    related: (productId: string) => ["products", "related", productId] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
  orders: {
    all: ["orders"] as const,
    list: (query: unknown) => ["orders", "list", query] as const,
    detail: (id: string) => ["orders", "detail", id] as const,
    byCustomer: (customerId: string) => ["orders", "customer", customerId] as const,
  },
  customers: {
    all: ["customers"] as const,
    list: (query: unknown) => ["customers", "list", query] as const,
    detail: (id: string) => ["customers", "detail", id] as const,
  },
  inventory: {
    summary: ["inventory", "summary"] as const,
    rows: ["inventory", "rows"] as const,
    activity: ["inventory", "activity"] as const,
  },
  reviews: {
    byProduct: (productId: string) => ["reviews", "product", productId] as const,
    moderation: ["reviews", "moderation"] as const,
  },
  coupons: { all: ["coupons"] as const },
  courier: { all: ["courier", "shipments"] as const },
  analytics: {
    dashboard: (range: string) => ["analytics", "dashboard", range] as const,
    revenue: (range: string) => ["analytics", "revenue", range] as const,
    productPerformance: ["analytics", "product-performance"] as const,
    funnel: ["analytics", "funnel"] as const,
    delivery: ["analytics", "delivery"] as const,
  },
  notifications: {
    all: (category?: string) => ["notifications", category ?? "all"] as const,
    unreadCount: ["notifications", "unread-count"] as const,
  },
  marketing: { campaigns: ["marketing", "campaigns"] as const },
  settings: { all: ["settings"] as const },
} as const;
