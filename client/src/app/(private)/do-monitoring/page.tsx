import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import DOContent from './components/do-content';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dissolved Oxygen Monitoring',
  description:
    'Continuously track oxygen levels in your pond to ensure a healthy and safe environment for your fish.',
};

export default function DOMonitoringPage() {
  return (
    <div>
      <DOContent />
    </div>
  );
}
