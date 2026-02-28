import TempTable from './features/temp-table';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Temperature Monitoring',
  description:
    'Track water temperature in real time to ensure optimal conditions for your fish.',
};

import React from 'react';

export default function TempLogs() {
  return (
    <div className="bg-background rounded-4xl">
      <TempTable />
    </div>
  );
}
