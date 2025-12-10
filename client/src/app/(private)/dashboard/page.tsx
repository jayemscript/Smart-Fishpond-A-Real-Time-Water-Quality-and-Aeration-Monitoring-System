import React from 'react';
import DashboardPageContent from './components/dashboard-page.content';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'View analytics, stats, and system overview',
};

export default function DashboardPage() {
  return (
    <div>
      <DashboardPageContent />
    </div>
  );
}
