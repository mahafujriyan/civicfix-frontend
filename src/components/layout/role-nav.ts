import type { NavItem } from "@/components/layout/nav"
import type { UserRole } from "@/types/domain"
import {
  Bell,
  Building2,
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  PieChart,
  Plus,
  Settings,
  Tags,
  Users,
  Wallet,
} from "lucide-react"

export const roleNav: Record<UserRole, NavItem[]> = {
  CITIZEN: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/complaints", label: "Complaints", icon: ClipboardList },
    { href: "/dashboard/complaints/new", label: "New complaint", icon: Plus, exact: true },
    { href: "/dashboard/payments", label: "Payments", icon: Wallet, exact: true },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell, exact: true },
    { href: "/dashboard/profile", label: "Profile", icon: Settings, exact: true },
  ],
  STAFF: [
    { href: "/staff", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/staff/complaints", label: "Queue", icon: ClipboardList },
    { href: "/staff/analytics", label: "Workload", icon: PieChart, exact: true },
    { href: "/staff/profile", label: "Profile", icon: Settings, exact: true },
  ],
  ADMIN: [
    { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/admin/users", label: "Users", icon: Users, exact: true },
    { href: "/admin/departments", label: "Departments", icon: Building2, exact: true },
    { href: "/admin/categories", label: "Categories", icon: Tags, exact: true },
    { href: "/admin/complaints", label: "Complaints", icon: ClipboardList },
    { href: "/admin/reports", label: "Reports", icon: FolderTree, exact: true },
    { href: "/admin/settings", label: "Settings", icon: Settings, exact: true },
  ],
}
