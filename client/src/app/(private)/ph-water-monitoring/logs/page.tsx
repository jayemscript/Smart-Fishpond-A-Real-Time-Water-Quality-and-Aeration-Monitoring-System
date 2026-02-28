import PhTable from './features/ph-table';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ph water Monitoring',
  description:
    'Continuously track water acidity levels to ensure a safe and balanced environment for your fish.',
};

import React from 'react';

export default function PhLogs() {
  return (
    <div className="bg-background rounded-4xl">
      <PhTable />
    </div>
  );
}
