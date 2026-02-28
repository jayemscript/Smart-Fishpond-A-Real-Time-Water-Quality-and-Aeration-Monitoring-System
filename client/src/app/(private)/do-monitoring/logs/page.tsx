import DoTable from './features/do-table';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dissolved Oxygen Monitoring',
  description:
    'Continuously track oxygen levels in your pond to ensure a healthy and safe environment for your fish.',
};


import React from 'react'

export default function DoLogs() {
  return (
    <div className="bg-background rounded-4xl">
      <DoTable />
    </div>
  );
}
