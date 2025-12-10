import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TurbidityContent from './components/turbidity.content';
import { AlertCircle } from 'lucide-react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Turbidity Monitoring',
  description:
    'Monitor water clarity in real time to maintain a healthy environment for your fish.',
};

export default function TurbidityMonitoringPage() {
  return (
    <div>
      <TurbidityContent />
    </div>
  );
}
