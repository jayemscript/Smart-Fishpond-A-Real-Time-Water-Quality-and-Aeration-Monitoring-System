import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <div className="flex items-center justify-center min-h-screen ">
        <Card className="w-[400px] text-center shadow-lg">
          <CardHeader>
            <AlertCircle className="mx-auto mb-2 text-red-500" size={48} />
            <CardTitle>Work in Progress</CardTitle>
          </CardHeader>
          <CardContent>
            This page is currently under development. Please check back later.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
