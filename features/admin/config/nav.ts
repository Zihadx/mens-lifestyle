import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ShoppingCart,
  Shirt,
  FolderTree,
  Boxes,
  Users,
  Truck,
  Wallet,
  Megaphone,
  Tag,
  Star,
  BarChart3,
  UserCog,
  Settings,
} from "lucide-react";
import type { UserRole } from "@/store/slices/session-slice";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Roles that can see this section. Admin always has full access. */
  allow: UserRole[];
}

export const adminNavItems: AdminNavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, allow: ["admin", "staff", "moderator"] },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart, allow: ["admin", "staff"] },
  { label: "Products", href: "/admin/products", icon: Shirt, allow: ["admin", "staff"] },
  { label: "Categories", href: "/admin/categories", icon: FolderTree, allow: ["admin", "staff"] },
  { label: "Inventory", href: "/admin/inventory", icon: Boxes, allow: ["admin", "staff"] },
  { label: "Customers", href: "/admin/customers", icon: Users, allow: ["admin", "staff"] },
  { label: "Courier", href: "/admin/courier", icon: Truck, allow: ["admin", "staff"] },
  { label: "Payments", href: "/admin/payments", icon: Wallet, allow: ["admin"] },
  { label: "Marketing", href: "/admin/marketing", icon: Megaphone, allow: ["admin"] },
  { label: "Coupons", href: "/admin/coupons", icon: Tag, allow: ["admin", "staff"] },
  { label: "Reviews", href: "/admin/reviews", icon: Star, allow: ["admin", "moderator"] },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3, allow: ["admin"] },
  { label: "Users", href: "/admin/users", icon: UserCog, allow: ["admin"] },
  { label: "Settings", href: "/admin/settings", icon: Settings, allow: ["admin"] },
];
