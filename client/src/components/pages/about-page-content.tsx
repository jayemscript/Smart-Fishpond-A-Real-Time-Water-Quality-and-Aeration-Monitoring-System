'use client';

import React from 'react';
import {
  Fish,
  Cpu,
  Radio,
  Database,
  Shield,
  Zap,
  ArrowLeft,
} from 'lucide-react';

export default function AboutPageContent() {
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
            <Fish className="h-4 w-4" />
            About the System
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            Pond Watch
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-chart-2 to-primary mt-2">
              Monitoring System
            </span>
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            An advanced IoT-based solution designed to modernize aquaculture
            management through real-time water quality monitoring and automated
            aeration control.
          </p>
        </div>

        {/* Mission */}
        <div className="relative mb-12">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-chart-2/20 rounded-3xl blur-2xl opacity-30" />
          <div className="relative bg-card rounded-3xl p-8 lg:p-12 border border-border backdrop-blur-xl">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-primary rounded-full" />
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To empower aquaculture operations with real-time insights and
              automated controls that increase productivity, reduce losses, and
              promote sustainable fish farming practices.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Technology Stack</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Cpu, title: 'Microcontroller' },
              { icon: Radio, title: 'Wireless Communication' },
              { icon: Database, title: 'Cloud Storage' },
              { icon: Shield, title: 'High-Precision Sensors' },
              { icon: Zap, title: 'Automated Control' },
              { icon: Fish, title: 'Dashboard Interface' },
            ].map(({ icon: Icon, title }) => (
              <div
                key={title}
                className="group bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-6 transition-all hover:border-primary/40 hover:scale-105"
              >
                <div className="bg-accent w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-primary">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Enterprise-grade implementation designed for reliability,
                  accuracy, and scalability.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-card rounded-3xl p-8 lg:p-12 border border-border">
          <h2 className="text-3xl font-bold mb-8">
            Why Choose Smart Fishpond?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Prevent Fish Mortality',
                desc: 'Early detection of dangerous water conditions prevents mass losses and protects your investment.',
              },
              {
                title: 'Increase Productivity',
                desc: 'Optimal water conditions improve growth rates and yield per cycle.',
              },
              {
                title: 'Save Time & Labor',
                desc: 'Automation reduces manual testing and aerator intervention.',
              },
              {
                title: 'Remote Monitoring',
                desc: 'Access live and historical data anywhere via web or mobile.',
              },
              {
                title: 'Data-Driven Decisions',
                desc: 'Historical trends support smarter farm management decisions.',
              },
              {
                title: 'Energy Efficient',
                desc: 'Smart control activates aeration only when required.',
              },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p className="text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
