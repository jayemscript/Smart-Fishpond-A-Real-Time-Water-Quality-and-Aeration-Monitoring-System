'use client';

import React from 'react';
import { Droplets, Activity, Waves, Gauge, ChevronRight } from 'lucide-react';
import { ThemeButtons } from '@/components/customs/theme-buttons';

export default function HomeSection() {
  return (
    // <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div 
          style={{
    backgroundImage: "url('/images/background-2.jpg')",

  }}
        className="min-h-screen  text-foreground flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-no-repeat bg-center bg-cover">
      <div className="max-w-7xl w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Side */}
          <div className="space-y-8">
            <div className="flex justify-end">
              <ThemeButtons />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/30">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                IoT Monitoring System Version 2
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Pond Watch
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-chart-2 to-primary mt-2">
                  Water Quality Monitor
                </span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                A real-time water quality and aeration monitoring system that
                ensures optimal conditions for aquaculture operations.
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { href: '/about', label: 'About System' },
                { href: '/explore', label: 'Explore' },
                { href: '/help', label: 'Help' },
              ].map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="group bg-card border border-border hover:border-primary/50 px-6 py-4 rounded-xl font-medium transition-all hover:bg-accent text-center"
                >
                  <span className="group-hover:text-primary transition-colors">
                    {label}
                  </span>
                </a>
              ))}

              <a
                href="/login"
                className="group bg-gradient-to-r from-primary to-chart-2 text-primary-foreground px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/40"
              >
                Login
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Right Side */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-chart-2/20 rounded-3xl blur-2xl opacity-50" />

            <div className="relative bg-card backdrop-blur-xl rounded-3xl p-8 border border-border shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">Live Monitoring</h3>
                <div className="flex items-center gap-2 text-primary">
                  <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-medium">Active</span>
                </div>
              </div>

              <div className="space-y-6">
                {/* pH */}
                <MetricCard label="pH Level" value="7.2" icon={<Droplets />} />

                {/* Oxygen */}
                <MetricCard
                  label="Dissolved O₂"
                  value="8.5 mg/L"
                  icon={<Gauge />}
                />

                {/* Temperature */}
                <MetricCard label="Temperature" value="28°C" icon={<Waves />} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- */
/* Metric Card                   */
/* ----------------------------- */

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-6 transition-all hover:border-primary/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary/20 p-3 rounded-xl text-primary">
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-4xl font-bold">{value}</p>
          </div>
        </div>
        <Activity className="h-6 w-6 text-primary animate-pulse" />
      </div>
    </div>
  );
}
