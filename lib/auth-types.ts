// ─── ROLE & PERMISSION SYSTEM ──────────────────────────────────────────────

export type UserRole = "owner" | "admin" | "manager" | "receptionist" | "accountant" | "chef" | "waiter" | "housekeeping" | "staff" | "viewer" | "agent";

export type ModuleId = "hotel" | "restaurant" | "laundry" | "tour" | "ticketing" | "accounts" | "hr" | "inventory" | "booking" | "crm";

export type ActionPerm = "view" | "create" | "edit" | "delete";

export interface ModulePermission {
  moduleId: ModuleId;
  actions: ActionPerm[];
}

export interface RolePermissions {
  canManageUsers: boolean;
  canManageBilling: boolean;
  canViewFinance: boolean;
  canViewReports: boolean;
  canManageSettings: boolean;
  canExportData: boolean;
}

export interface TenantUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  modules: ModuleId[];
  permissions: RolePermissions;
  branch: string;
  department: string;
  status: "active" | "inactive" | "on-leave";
  joinedAt: string;
  lastLogin: string;
}

// ─── ROLE TEMPLATES ────────────────────────────────────────────────────────

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: "Owner",
  admin: "Admin",
  manager: "Manager",
  receptionist: "Receptionist",
  accountant: "Accountant",
  chef: "Chef / Kitchen",
  waiter: "Waiter / Server",
  housekeeping: "Housekeeping",
  staff: "Staff",
  viewer: "Viewer (Read Only)",
  agent: "Agent",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  owner: "bg-brand-100 text-brand-700",
  admin: "bg-danger-100 text-danger-700",
  manager: "bg-tour-100 text-tour-700",
  receptionist: "bg-hotel-100 text-hotel-700",
  accountant: "bg-accounts-100 text-accounts-700",
  chef: "bg-restaurant-100 text-restaurant-700",
  waiter: "bg-restaurant-100 text-restaurant-600",
  housekeeping: "bg-laundry-100 text-laundry-700",
  staff: "bg-gray-100 text-gray-600",
  viewer: "bg-gray-100 text-gray-500",
  agent: "bg-ticketing-100 text-ticketing-700",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  owner: "Full access to all modules, settings, billing, and user management",
  admin: "Full operational access. Cannot change billing or ownership.",
  manager: "Manage operations for assigned modules. No user management.",
  receptionist: "Hotel front desk — bookings, check-in/out, guests only",
  accountant: "Finance and accounting modules only. Read-only on operations.",
  chef: "Kitchen Display System and menu management only",
  waiter: "POS terminal and table management only",
  housekeeping: "Room status and housekeeping tasks only",
  staff: "Limited access to assigned tasks within assigned modules",
  viewer: "Read-only access to dashboards of assigned modules",
  agent: "Tour and ticketing operations only",
};

// Default module access per role (can be customized per user)
export const ROLE_DEFAULT_MODULES: Record<UserRole, ModuleId[]> = {
  owner: ["hotel", "restaurant", "laundry", "tour", "ticketing", "accounts", "hr", "inventory", "booking", "crm"],
  admin: ["hotel", "restaurant", "laundry", "tour", "ticketing", "accounts", "hr", "inventory", "booking", "crm"],
  manager: ["hotel", "restaurant", "laundry", "tour", "accounts", "inventory"],
  receptionist: ["hotel", "booking"],
  accountant: ["accounts"],
  chef: ["restaurant", "inventory"],
  waiter: ["restaurant"],
  housekeeping: ["hotel"],
  staff: [],
  viewer: [],
  agent: ["tour", "ticketing"],
};

export const ROLE_DEFAULT_PERMISSIONS: Record<UserRole, RolePermissions> = {
  owner: { canManageUsers: true, canManageBilling: true, canViewFinance: true, canViewReports: true, canManageSettings: true, canExportData: true },
  admin: { canManageUsers: true, canManageBilling: false, canViewFinance: true, canViewReports: true, canManageSettings: true, canExportData: true },
  manager: { canManageUsers: false, canManageBilling: false, canViewFinance: true, canViewReports: true, canManageSettings: false, canExportData: true },
  receptionist: { canManageUsers: false, canManageBilling: false, canViewFinance: false, canViewReports: false, canManageSettings: false, canExportData: false },
  accountant: { canManageUsers: false, canManageBilling: false, canViewFinance: true, canViewReports: true, canManageSettings: false, canExportData: true },
  chef: { canManageUsers: false, canManageBilling: false, canViewFinance: false, canViewReports: false, canManageSettings: false, canExportData: false },
  waiter: { canManageUsers: false, canManageBilling: false, canViewFinance: false, canViewReports: false, canManageSettings: false, canExportData: false },
  housekeeping: { canManageUsers: false, canManageBilling: false, canViewFinance: false, canViewReports: false, canManageSettings: false, canExportData: false },
  staff: { canManageUsers: false, canManageBilling: false, canViewFinance: false, canViewReports: false, canManageSettings: false, canExportData: false },
  viewer: { canManageUsers: false, canManageBilling: false, canViewFinance: false, canViewReports: false, canManageSettings: false, canExportData: false },
  agent: { canManageUsers: false, canManageBilling: false, canViewFinance: false, canViewReports: true, canManageSettings: false, canExportData: false },
};

// ─── DEMO USERS PER TENANT TYPE ───────────────────────────────────────────

export type TenantType = "hotel" | "restaurant" | "laundry" | "tour" | "mixed";

export const TENANT_USERS: Record<TenantType, TenantUser[]> = {
  hotel: [
    {
      id: "u1", name: "Mohammed Karim", email: "karim@diamond.com", phone: "01711-000001",
      role: "owner", avatar: "MK", modules: ["hotel", "restaurant", "laundry", "accounts", "inventory", "hr", "booking"],
      permissions: ROLE_DEFAULT_PERMISSIONS.owner,
      branch: "Main Branch", department: "Management", status: "active",
      joinedAt: "2025-01-15", lastLogin: "2 min ago",
    },
    {
      id: "u2", name: "Sara Islam", email: "sara@diamond.com", phone: "01812-000002",
      role: "receptionist", avatar: "SI", modules: ["hotel", "booking"],
      permissions: ROLE_DEFAULT_PERMISSIONS.receptionist,
      branch: "Main Branch", department: "Front Desk", status: "active",
      joinedAt: "2025-03-20", lastLogin: "10 min ago",
    },
    {
      id: "u3", name: "Rafiq Ahmed", email: "rafiq@diamond.com", phone: "01912-000003",
      role: "accountant", avatar: "RA", modules: ["accounts"],
      permissions: ROLE_DEFAULT_PERMISSIONS.accountant,
      branch: "Main Branch", department: "Finance", status: "active",
      joinedAt: "2025-02-01", lastLogin: "1 hr ago",
    },
    {
      id: "u4", name: "Sumon Ali", email: "sumon@diamond.com", phone: "01611-000004",
      role: "housekeeping", avatar: "SA", modules: ["hotel"],
      permissions: ROLE_DEFAULT_PERMISSIONS.housekeeping,
      branch: "Main Branch", department: "Housekeeping", status: "active",
      joinedAt: "2025-04-10", lastLogin: "30 min ago",
    },
    {
      id: "u5", name: "Mina Begum", email: "mina@diamond.com", phone: "01511-000005",
      role: "chef", avatar: "MB", modules: ["restaurant", "inventory"],
      permissions: ROLE_DEFAULT_PERMISSIONS.chef,
      branch: "Main Branch", department: "Kitchen", status: "active",
      joinedAt: "2025-05-01", lastLogin: "5 min ago",
    },
    {
      id: "u6", name: "Tanvir Rahman", email: "tanvir@diamond.com", phone: "01311-000006",
      role: "manager", avatar: "TR", modules: ["hotel", "restaurant", "laundry", "inventory"],
      permissions: ROLE_DEFAULT_PERMISSIONS.manager,
      branch: "Main Branch", department: "Operations", status: "active",
      joinedAt: "2025-02-15", lastLogin: "20 min ago",
    },
    {
      id: "u7", name: "Riya Akter", email: "riya@diamond.com", phone: "01211-000007",
      role: "waiter", avatar: "RA", modules: ["restaurant"],
      permissions: ROLE_DEFAULT_PERMISSIONS.waiter,
      branch: "Main Branch", department: "Restaurant", status: "active",
      joinedAt: "2025-06-01", lastLogin: "15 min ago",
    },
  ],
  restaurant: [
    {
      id: "u10", name: "Rahim Uddin", email: "rahim@abcrest.com", phone: "01711-100001",
      role: "owner", avatar: "RU", modules: ["restaurant", "inventory", "accounts"],
      permissions: ROLE_DEFAULT_PERMISSIONS.owner,
      branch: "Gulshan Branch", department: "Management", status: "active",
      joinedAt: "2025-01-28", lastLogin: "5 min ago",
    },
    {
      id: "u11", name: "Karim Waiter", email: "karimw@abcrest.com", phone: "01812-100002",
      role: "waiter", avatar: "KW", modules: ["restaurant"],
      permissions: ROLE_DEFAULT_PERMISSIONS.waiter,
      branch: "Gulshan Branch", department: "Service", status: "active",
      joinedAt: "2025-03-01", lastLogin: "2 min ago",
    },
    {
      id: "u12", name: "Chef Hasan", email: "hasan@abcrest.com", phone: "01912-100003",
      role: "chef", avatar: "CH", modules: ["restaurant", "inventory"],
      permissions: ROLE_DEFAULT_PERMISSIONS.chef,
      branch: "Gulshan Branch", department: "Kitchen", status: "active",
      joinedAt: "2025-02-15", lastLogin: "1 min ago",
    },
    {
      id: "u13", name: "Nadia Manager", email: "nadia@abcrest.com", phone: "01611-100004",
      role: "manager", avatar: "NM", modules: ["restaurant", "inventory", "accounts"],
      permissions: ROLE_DEFAULT_PERMISSIONS.manager,
      branch: "Gulshan Branch", department: "Operations", status: "active",
      joinedAt: "2025-02-01", lastLogin: "30 min ago",
    },
  ],
  laundry: [
    {
      id: "u20", name: "Jamal Owner", email: "jamal@lking.com", phone: "01711-200001",
      role: "owner", avatar: "JO", modules: ["laundry", "accounts"],
      permissions: ROLE_DEFAULT_PERMISSIONS.owner,
      branch: "Mirpur Branch", department: "Management", status: "active",
      joinedAt: "2026-04-10", lastLogin: "1 hr ago",
    },
    {
      id: "u21", name: "Rina Staff", email: "rina@lking.com", phone: "01812-200002",
      role: "staff", avatar: "RS", modules: ["laundry"],
      permissions: { ...ROLE_DEFAULT_PERMISSIONS.staff },
      branch: "Mirpur Branch", department: "Operations", status: "active",
      joinedAt: "2026-04-12", lastLogin: "20 min ago",
    },
  ],
  tour: [
    {
      id: "u30", name: "Farhan Boss", email: "farhan@tourbd.com", phone: "01711-300001",
      role: "owner", avatar: "FB", modules: ["tour", "ticketing", "accounts", "crm"],
      permissions: ROLE_DEFAULT_PERMISSIONS.owner,
      branch: "Head Office", department: "Management", status: "active",
      joinedAt: "2026-02-05", lastLogin: "10 min ago",
    },
    {
      id: "u31", name: "Sadia Agent", email: "sadia@tourbd.com", phone: "01812-300002",
      role: "agent", avatar: "SA", modules: ["tour", "ticketing"],
      permissions: ROLE_DEFAULT_PERMISSIONS.agent,
      branch: "Head Office", department: "Sales", status: "active",
      joinedAt: "2026-03-01", lastLogin: "5 min ago",
    },
    {
      id: "u32", name: "Nasir Accountant", email: "nasir@tourbd.com", phone: "01912-300003",
      role: "accountant", avatar: "NA", modules: ["accounts"],
      permissions: ROLE_DEFAULT_PERMISSIONS.accountant,
      branch: "Head Office", department: "Finance", status: "active",
      joinedAt: "2026-02-20", lastLogin: "1 hr ago",
    },
  ],
  mixed: [
    {
      id: "u40", name: "Ahmed Director", email: "ahmed@grandhorizon.com", phone: "01711-400001",
      role: "owner", avatar: "AD", modules: ["hotel", "tour", "ticketing", "accounts", "hr", "restaurant"],
      permissions: ROLE_DEFAULT_PERMISSIONS.owner,
      branch: "Main Resort", department: "Management", status: "active",
      joinedAt: "2025-12-01", lastLogin: "1 min ago",
    },
    {
      id: "u41", name: "Fatema Receptionist", email: "fatema@grandhorizon.com", phone: "01812-400002",
      role: "receptionist", avatar: "FR", modules: ["hotel", "booking"],
      permissions: ROLE_DEFAULT_PERMISSIONS.receptionist,
      branch: "Main Resort", department: "Front Desk", status: "active",
      joinedAt: "2026-01-15", lastLogin: "5 min ago",
    },
    {
      id: "u42", name: "Kamal Tour Agent", email: "kamal@grandhorizon.com", phone: "01912-400003",
      role: "agent", avatar: "KA", modules: ["tour", "ticketing"],
      permissions: ROLE_DEFAULT_PERMISSIONS.agent,
      branch: "Main Resort", department: "Tour Desk", status: "active",
      joinedAt: "2026-01-20", lastLogin: "15 min ago",
    },
  ],
};
