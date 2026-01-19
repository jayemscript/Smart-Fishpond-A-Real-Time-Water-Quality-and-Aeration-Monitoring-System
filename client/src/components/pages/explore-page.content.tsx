'use client';

import React from 'react';
import {
  ArrowLeft,
  Droplets,
  Zap,
  Bell,
  BarChart3,
  Activity,
} from 'lucide-react';

export default function ExplorePageContent() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Back */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </a>

        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/30">
            <Activity className="h-4 w-4" />
            What We Do
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            What Does This
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-chart-2 to-primary mt-2">
              System Do?
            </span>
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            Smart Fishpond continuously monitors water quality and automatically
            controls aeration to keep fish healthy and productive.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <FeatureCard
            icon={<Droplets />}
            title="Monitors Water Quality"
            items={[
              'pH level',
              'Dissolved oxygen',
              'Water temperature',
              'Turbidity',
            ]}
          >
            The system checks key water parameters 24/7 to ensure optimal fish
            conditions.
          </FeatureCard>

          <FeatureCard
            icon={<Zap />}
            title="Controls Aeration"
            items={[
              'Automatic aerator activation',
              'Prevents oxygen depletion',
              'Energy efficient operation',
              'Manual override available',
            ]}
          >
            When oxygen drops below safe levels, aerators automatically activate.
          </FeatureCard>

          <FeatureCard
            icon={<Bell />}
            title="Sends Alerts"
            items={[
              'Real-time warnings',
              'SMS or email notifications',
              'Custom thresholds',
              'Remote access',
            ]}
          >
            Receive instant notifications when conditions become unsafe.
          </FeatureCard>

          <FeatureCard
            icon={<BarChart3 />}
            title="Shows Data & History"
            items={[
              'Live dashboard',
              'Historical trends',
              'Exportable reports',
              'Mobile and desktop access',
            ]}
          >
            Visualize real-time and historical water data using charts.
          </FeatureCard>
        </div>

        {/* How it works */}
        <div className="bg-card rounded-3xl p-8 lg:p-12 border border-border">
          <h2 className="text-3xl font-bold mb-8 text-center">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                step: 1,
                title: 'Sensors Collect Data',
                desc:
                  'Sensors measure pH, oxygen, temperature, and turbidity.',
              },
              {
                step: 2,
                title: 'System Analyzes',
                desc:
                  'Readings are checked against safe thresholds.',
              },
              {
                step: 3,
                title: 'Takes Action',
                desc:
                  'Aerators activate and alerts are sent when needed.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step}>
                <div className="bg-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-primary">
                    {step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ----------------------------- */
/* Feature Card                  */
/* ----------------------------- */

function FeatureCard({
  icon,
  title,
  items,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="relative group">
      <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-chart-2/20 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
      <div className="relative bg-card rounded-3xl p-8 border border-border hover:border-primary/50 transition-all">
        <div className="bg-primary/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-primary">
          {icon}
        </div>
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-lg text-muted-foreground mb-6">{children}</p>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item} className="flex items-center gap-3 text-muted-foreground">
              <span className="w-2 h-2 bg-primary rounded-full" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
