'use client';

import React from 'react';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import UserListOnline from '@/components/sections/dashboards/user-list-online';
import { formatDate } from '@syntaxsentinel/date-utils';
import { hasRole } from '@/utils/role.utils';

export default function DashboardPageContent() {
  const { user } = useAuthCheck();

  return (
    <div className="p-6">
      <div className="w-full  ">
        <div className="flex flex-row items-center justify-between p-6">
          <div>
            <h2 className="text-2xl font-semibold capitalize">
              Welcome, {user?.username || 'User'}
            </h2>

            <div className="text-muted-foreground mt-1">
              <div className="flex flex-col items-start justify-center">
                <span>Here’s an overview of your dashboard.</span>
                <span>as of {formatDate.longDate(new Date())}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="m-5 p-5 space-y-4">
          <UserListOnline />
        </div>
      </div>
    </div>
  );
}
