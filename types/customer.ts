export interface Customer {
  id: string;

  name: string;
  email: string;
  phone: string | null;

  role: "customer" | "admin" | "staff";
  status: "active" | "inactive" | "suspended";

  department: string | null;
  designation: string | null;

  email_verified: boolean;
  phone_verified: boolean;

  joined_at: string;
  last_active_at: string | null;

  totalOrders?: number;
  totalSpent?: number;
  averageOrderValue?: number;

  addresses?: CustomerAddress[];

  riskLevel?: "low" | "medium" | "high";
}

export interface CustomerAddress {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  isDefault?: boolean;
}