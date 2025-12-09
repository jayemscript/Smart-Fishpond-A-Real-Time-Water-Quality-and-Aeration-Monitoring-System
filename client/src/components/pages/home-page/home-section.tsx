'use client';

import React from 'react';
import { Droplets, Activity, Waves, Gauge, ChevronRight } from 'lucide-react';

export default function HomeSection() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-foreground flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-primary/30">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                IoT Monitoring System
              </div>
              <h1 className="text-5xl sm:text-9xl lg:text-9xl font-bold leading-tight mb-6">
                Smart Fishpond
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-primary via-emerald-400 to-primary mt-2">
                  Water Quality Monitor
                </span>
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                A Real-Time Water Quality and Aeration Monitoring System that
                ensures optimal conditions for your aquaculture operations.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <a
                href="/about"
                className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-primary/50 px-6 py-4 rounded-xl font-medium transition-all hover:bg-slate-800/80 text-center"
              >
                <span className="group-hover:text-primary transition-colors">
                  About System
                </span>
              </a>
              <a
                href="/explore"
                className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-primary/50 px-6 py-4 rounded-xl font-medium transition-all hover:bg-slate-800/80 text-center"
              >
                <span className="group-hover:text-primary transition-colors">
                  Explore
                </span>
              </a>
              <a
                href="/help"
                className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-primary/50 px-6 py-4 rounded-xl font-medium transition-all hover:bg-slate-800/80 text-center"
              >
                <span className="group-hover:text-primary transition-colors">
                  Help
                </span>
              </a>
              <a
                href="/login"
                className="group bg-gradient-to-r from-primary to-emerald-500 text-slate-900 px-6 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all flex items-center justify-center gap-2"
              >
                <span>Login</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Side - Live Data Card */}
          <div className="relative">
            <div className="absolute -inset-4 bg-linear-to-r from-primary/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-50"></div>

            <div className="relative bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">Live Monitoring</h3>
                <div className="flex items-center gap-2 text-primary">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Active</span>
                </div>
              </div>

              <div className="space-y-6">
                {/* pH Level */}
                <div className="group bg-linear-to-br from-primary/10 to-primary/5 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/20 p-3 rounded-xl">
                        <Droplets className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">pH Level</p>
                        <p className="text-4xl font-bold text-white">7.2</p>
                      </div>
                    </div>
                    <Activity className="h-6 w-6 text-primary animate-pulse" />
                  </div>
                </div>

                {/* Dissolved O2 */}
                <div className="group bg-linear-to-br from-emerald-500/10 to-emerald-500/5 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-500/20 p-3 rounded-xl">
                        <Gauge className="h-8 w-8 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">
                          Dissolved O₂
                        </p>
                        <p className="text-4xl font-bold text-white">
                          8.5{' '}
                          <span className="text-xl text-slate-400">mg/L</span>
                        </p>
                      </div>
                    </div>
                    <Activity className="h-6 w-6 text-emerald-400 animate-pulse" />
                  </div>
                </div>

                {/* Temperature */}
                <div className="group bg-linear-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-cyan-500/20 p-3 rounded-xl">
                        <Waves className="h-8 w-8 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">
                          Temperature
                        </p>
                        <p className="text-4xl font-bold text-white">28°C</p>
                      </div>
                    </div>
                    <Activity className="h-6 w-6 text-cyan-400 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
