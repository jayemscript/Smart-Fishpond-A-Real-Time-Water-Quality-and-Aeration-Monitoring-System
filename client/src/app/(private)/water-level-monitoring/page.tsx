import React from 'react';
import type { Metadata } from 'next';
import WaterLevelContent from './components/water-level.content';

export const metadata: Metadata = {
  title: 'Water Level Monitoring',
  description:
    'Keep track of water levels in real time to prevent overflow or low water conditions in your fishpond.',
};

export default function WaterLevelMonitoringPage() {
  return (
    <div>
      <WaterLevelContent />
    </div>
  );
}
