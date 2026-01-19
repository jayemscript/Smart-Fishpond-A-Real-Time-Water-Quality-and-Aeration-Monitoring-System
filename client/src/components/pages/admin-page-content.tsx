'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import UsersTable from '@/containers/users-containers/users-table';
import RolesTable from '@/containers/rbac-containers/roles-table';
import PermissionsTable from '@/containers/rbac-containers/permissions-table';
import AuditLogsTable from '@/containers/audit-logs-containers/audit-logs-table';
import TabsComponent from '@/components/customs/tabs/tabs-component';
import {
  UsersIcon,
  ShieldIcon,
  KeyRound,
  IdCardLanyard,
  Logs,
} from 'lucide-react';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';
import { getUserById } from '@/api/protected/user.api';
import { canAccess } from '@/utils/check-access';
import { extractErrorMessage } from '@/configs/api.helper';

const DEFAULT_TAB = 'users';

function AdminPageContent() {
  const { user } = useAuthCheck();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [latestUser, setLatestUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  // Derive activeTab **only** from URL
  const urlTab = searchParams.get('tab');
  const isValidTab = [
    'users',
    'roles',
    'permissions',
    'employees',
    'audits_logs',
  ].includes(urlTab || '');
  const activeTab = isValidTab ? urlTab! : DEFAULT_TAB;

  useEffect(() => {
    const fetchLatestUser = async () => {
      try {
        if (!user?.id) return;

        const response = await getUserById(user.id);
        const freshUser = response.data;
        setLatestUser(freshUser);

        const currentPath = `/admin?tab=${activeTab}`;
        const allowed = canAccess(freshUser.access, currentPath);
        setIsAllowed(allowed);

        if (!allowed) {
          router.replace('/unauthorized');
        }
      } catch (error) {
        console.log(extractErrorMessage(error));
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestUser();
  }, [user?.id, activeTab, router]);

  // Sync localStorage whenever activeTab changes (due to URL)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminActiveTab', activeTab);
    }
  }, [activeTab]);

  // Ensure URL always has a tab (redirect if missing or invalid)
  useEffect(() => {
    if (!urlTab || !isValidTab) {
      router.replace(`/admin?tab=${DEFAULT_TAB}`, { scroll: false });
    }
  }, [urlTab, isValidTab, router]);

  if (loading || isAllowed === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isAllowed === false) return null;

  const items = [
    {
      value: 'users',
      label: 'Users',
      icon: UsersIcon,
      component: <UsersTable />,
    },
    {
      value: 'roles',
      label: 'Roles',
      icon: ShieldIcon,
      component: <RolesTable />,
    },
    {
      value: 'permissions',
      label: 'Permissions',
      icon: KeyRound,
      component: <PermissionsTable />,
    },
    {
      value: 'audits_logs',
      label: 'System Audit Logs',
      icon: Logs,
      component: <AuditLogsTable />,
    },
  ];

  const handleTabChange = (value: string) => {
    router.push(`/admin?tab=${value}`, { scroll: false });
  };

  return (
    <div className="p-6">
      <TabsComponent
        items={items}
        value={activeTab}
        onValueChange={handleTabChange}
      />
    </div>
  );
}

// Loading fallback component
function AdminPageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
      </div>
    </div>
  );
}

// Wrap with Suspense
export default function AdminPage() {
  return (
    <Suspense fallback={<AdminPageLoading />}>
      <AdminPageContent />
    </Suspense>
  );
}
