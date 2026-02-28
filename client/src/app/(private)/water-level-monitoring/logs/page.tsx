import TempTable from './features/waterlevel-table';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Water Level Monitoring',
  description:
    'Keep track of water levels in real time to prevent overflow or low water conditions in your fishpond.',
};

import React from 'react';

export default function WaterLevelLogs() {
  return (
    <div className="bg-background rounded-4xl">
      <TempTable />
    </div>
  );
}
