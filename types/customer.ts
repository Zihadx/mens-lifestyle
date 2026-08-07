export type CustomerRiskLevel = "trusted" | "normal" | "watch";

export interface CustomerAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  district: string;
  area: string;
  addressLine: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  addresses: CustomerAddress[];
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderAt?: string;
  codSuccessRate: number;
  returnCount: number;
  riskLevel: CustomerRiskLevel;
  createdAt: string;
}
