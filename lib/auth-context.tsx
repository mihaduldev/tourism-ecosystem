"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type TenantUser, type TenantType, type ModuleId, TENANT_USERS } from "./auth-types";

interface AuthContextValue {
  currentUser: TenantUser;
  tenantType: TenantType;
  tenantUsers: TenantUser[];
  switchUser: (userId: string) => void;
  switchTenant: (type: TenantType) => void;
  hasModuleAccess: (moduleId: ModuleId) => boolean;
  hasPermission: (perm: keyof TenantUser["permissions"]) => boolean;
  userModules: ModuleId[];
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children, initialType = "hotel" }: { children: ReactNode; initialType?: TenantType }) {
  const [tenantType, setTenantType] = useState<TenantType>(initialType);
  const [userId, setUserId] = useState<string>(TENANT_USERS[initialType][0].id);

  const tenantUsers = TENANT_USERS[tenantType];
  const currentUser = tenantUsers.find(u => u.id === userId) ?? tenantUsers[0];

  const switchUser = useCallback((id: string) => {
    setUserId(id);
  }, []);

  const switchTenant = useCallback((type: TenantType) => {
    setTenantType(type);
    setUserId(TENANT_USERS[type][0].id);
  }, []);

  const hasModuleAccess = useCallback((moduleId: ModuleId) => {
    if (currentUser.role === "owner" || currentUser.role === "admin") return true;
    return currentUser.modules.includes(moduleId);
  }, [currentUser]);

  const hasPermission = useCallback((perm: keyof TenantUser["permissions"]) => {
    return currentUser.permissions[perm];
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{
      currentUser,
      tenantType,
      tenantUsers,
      switchUser,
      switchTenant,
      hasModuleAccess,
      hasPermission,
      userModules: currentUser.modules,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
