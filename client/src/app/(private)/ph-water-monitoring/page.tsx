import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PHWaterContent from './components/ph-water.content';
import { AlertCircle } from 'lucide-react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ph water Monitoring',
  description:
    'Continuously track water acidity levels to ensure a safe and balanced environment for your fish.',
};

export default function PHWaterMonitoringPage() {
  return (
    <div>
      <PHWaterContent />
    </div>
  );
}
