// app/(private)/admin/layout.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';
import { getUserById } from '@/api/protected/user.api';
import { canAccess } from '@/utils/check-access';
import { extractErrorMessage } from '@/configs/api.helper';
import TabsComponent from '@/components/customs/tabs/tabs-component';
import {
  UsersIcon,
  ShieldIcon,
  KeyRound,
  IdCardLanyard,
  Logs,
} from 'lucide-react';

const TAB_ROUTES = [
  { value: 'users', label: 'Users', icon: UsersIcon, path: '/admin/users' },
  { value: 'roles', label: 'Roles', icon: ShieldIcon, path: '/admin/roles' },
  {
    value: 'permissions',
    label: 'Permissions',
    icon: KeyRound,
    path: '/admin/permissions',
  },
  // {
  //   value: 'employees',
  //   label: 'Employees',
  //   icon: IdCardLanyard,
  //   path: '/admin/employees',
  // },
  {
    value: 'audit-logs',
    label: 'System Audit Logs',
    icon: Logs,
    path: '/admin/audit-logs',
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuthCheck(null);
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  const currentTab =
    TAB_ROUTES.find((route) => pathname.startsWith(route.path))?.value ||
    'users';

  useEffect(() => {
    if (authLoading) return;
    const checkAccess = async () => {
      try {
        if (!user?.id) {
          router.replace('/login');
          return;
        }

        const response = await getUserById(user.id);
        const freshUser = response.data;

        let allowed = false;

        if (pathname === '/admin') {
          allowed = TAB_ROUTES.some((route) =>
            canAccess(freshUser.access, route.path),
          );
        } else {
          allowed = canAccess(freshUser.access, pathname);
        }

        setIsAllowed(allowed);

        if (!allowed) {
          router.replace('/unauthorized');
        }
      } catch (error) {
        console.error(extractErrorMessage(error));
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user?.id, pathname, authLoading]);

  const handleTabChange = useCallback(
    (value: string) => {
      const route = TAB_ROUTES.find((r) => r.value === value);
      if (route) {
        router.push(route.path);
      }
    },
    [router],
  );

  if (loading || authLoading || isAllowed === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isAllowed === false) return null;

  const tabItems = TAB_ROUTES.map((route) => ({
    value: route.value,
    label: route.label,
    icon: route.icon,
    component: null,
  }));

  return (
    <div className="p-6 bg-background rounded-3xl">
      <TabsComponent
        items={tabItems}
        value={currentTab}
        onValueChange={handleTabChange}
      />
      <div className="mt-6">{children}</div>
    </div>
  );
}
