'use client';
import React from 'react';
import {
  ArrowLeft,
  Thermometer,
  Droplets,
  Waves,
  Circle,
  AlertCircle,
} from 'lucide-react';

export default function HelpPageContent() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </a>

        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/30">
            <AlertCircle className="h-4 w-4" />
            How to Use
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            Monitoring
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-chart-2 to-primary mt-2">
              Modules Guide
            </span>
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            Learn how to use and interpret data from each monitoring module to
            maintain optimal water conditions for your fishpond.
          </p>
        </div>

        {/* Monitoring Modules */}
        <div className="space-y-10">
          <ModuleCard
            icon={<Thermometer />}
            title="Temperature Monitoring"
            description="Monitors water temperature in real-time to ensure optimal conditions for fish health and growth."
            optimal="25°C – 30°C for most freshwater fish species"
            alert="Alerts above 32°C or below 23°C"
            tips={[
              'Check temperature in morning and afternoon',
              'High temperature reduces oxygen levels',
              'Avoid sudden temperature changes',
            ]}
          />


          <ModuleCard
            icon={<Droplets />}
            title="pH Water Monitoring"
            description="Tracks acidity and alkalinity critical for fish health and biological balance."
            optimal="6.5 – 8.5 pH"
            alert="Alerts below 6.0 or above 9.0"
            tips={[
              'pH fluctuates daily due to photosynthesis',
              'Use lime to raise pH when low',
              'Regular monitoring prevents disease',
            ]}
          />

          <ModuleCard
            icon={<Waves />}
            title="Water Level Monitoring"
            description="Tracks pond depth to prevent overflow or low-water stress conditions."
            optimal="Consistent depth (typically 1–2 meters)"
            alert="Alerts at ±20% deviation"
            tips={[
              'Low levels reduce oxygen availability',
              'Monitor closely during dry seasons',
              'Sudden drops may indicate leaks',
            ]}
          />
        </div>

        {/* Quick Reference */}
        <div className="mt-16 bg-card rounded-3xl p-8 border border-border shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Quick Reference Guide</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 pr-4 font-semibold text-muted-foreground">
                    Parameter
                  </th>
                  <th className="pb-3 pr-4 font-semibold text-muted-foreground">
                    Optimal Range
                  </th>
                  <th className="pb-3 font-semibold text-muted-foreground">
                    Critical Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border">
                  <td className="py-4 pr-4">Temperature</td>
                  <td className="py-4 pr-4">25–30°C</td>
                  <td className="py-4">Increase aeration if &gt; 32°C</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-4 pr-4">Turbidity</td>
                  <td className="py-4 pr-4">20–50 NTU</td>
                  <td className="py-4">Reduce feeding if &gt; 80 NTU</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-4 pr-4">pH Level</td>
                  <td className="py-4 pr-4">6.5–8.5</td>
                  <td className="py-4">Add lime if &lt; 6.0</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4">Water Level</td>
                  <td className="py-4 pr-4">Consistent depth</td>
                  <td className="py-4">Add water if drops &gt; 20%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* Reusable Module Card              */
/* -------------------------------- */

function ModuleCard({
  icon,
  title,
  description,
  optimal,
  alert,
  tips,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  optimal: string;
  alert: string;
  tips: string[];
}) {
  return (
    <div className="relative">
      <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-chart-2/20 rounded-3xl blur-xl opacity-30" />

      <div className="relative bg-card rounded-3xl p-8 lg:p-10 border border-border shadow-xl">
        <div className="flex items-start gap-6">
          <div className="bg-primary/15 p-4 rounded-2xl text-primary shrink-0">
            {icon}
          </div>

          <div className="grow">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {description}
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <InfoBox title="Optimal Range" value={optimal} />
              <InfoBox title="Alert Threshold" value={alert} />
            </div>

            <div className="mt-6 bg-muted/50 border border-border rounded-xl p-5">
              <h3 className="font-semibold text-lg mb-3 text-primary">
                Usage Tips
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                {tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-muted/40 rounded-xl p-5 border border-border">
      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
        <Circle className="h-3 w-3 fill-primary text-primary" />
        {title}
      </h3>
      <p className="text-muted-foreground">{value}</p>
    </div>
  );
}
