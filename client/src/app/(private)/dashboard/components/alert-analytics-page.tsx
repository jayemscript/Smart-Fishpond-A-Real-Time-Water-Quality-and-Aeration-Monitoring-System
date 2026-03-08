'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getSensorAlertReport } from '@/api/protected/sensor-logs/sensor-logs.api';
import { extractErrorMessage } from '@/configs/api.helper';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SensorReading {
  timestamp: string;
  value: number | string;
  isAbnormal: boolean;
}

interface AlertReportJson {
  sensorType: string;
  sensorLabel: string;
  generatedAt: string;
  windowMinutes: number;
  totalReadingsInWindow: number;
  abnormalReadingsInWindow: number;
  thresholdToAlert: number;
  alertTriggered: boolean;
  lastAlertSentAt: string | null;
  cooldownMinutes: number;
  readings: SensorReading[];
}

interface FullAlertReportJson {
  reportTitle: string;
  generatedAt: string;
  sensors: AlertReportJson[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPHT(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-PH', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatShortPHT(iso: string): string {
  return new Date(iso).toLocaleString('en-PH', {
    timeZone: 'Asia/Manila',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

const SENSOR_COLOR: Record<string, string> = {
  temperature: 'bg-orange-100 text-orange-700 border-orange-200',
  phWater: 'bg-blue-100 text-blue-700 border-blue-200',
  dissolvedOxygen: 'bg-teal-100 text-teal-700 border-teal-200',
  waterLevel: 'bg-indigo-100 text-indigo-700 border-indigo-200',
};

const SENSOR_ACCENT: Record<string, string> = {
  temperature: '#ea580c',
  phWater: '#2563eb',
  dissolvedOxygen: '#0d9488',
  waterLevel: '#4f46e5',
};

// ─── PDF Generation ───────────────────────────────────────────────────────────

async function generatePDF(report: FullAlertReportJson) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW = 210;
  const pageH = 297;
  const marginL = 20;
  const marginR = 20;
  const contentW = pageW - marginL - marginR;
  let y = 0;

  const colors = {
    primary: [30, 58, 138] as [number, number, number],      // dark blue
    secondary: [71, 85, 105] as [number, number, number],    // slate
    accent: [220, 38, 38] as [number, number, number],       // red
    success: [22, 163, 74] as [number, number, number],      // green
    warning: [234, 88, 12] as [number, number, number],      // orange
    light: [248, 250, 252] as [number, number, number],      // near white
    border: [226, 232, 240] as [number, number, number],     // slate-200
    text: [15, 23, 42] as [number, number, number],          // almost black
    muted: [100, 116, 139] as [number, number, number],      // slate-500
    white: [255, 255, 255] as [number, number, number],
    headerBg: [15, 23, 42] as [number, number, number],      // dark navy
    alertRed: [254, 242, 242] as [number, number, number],   // red-50
  };

  function checkPageBreak(neededHeight: number) {
    if (y + neededHeight > pageH - 20) {
      doc.addPage();
      y = 20;
    }
  }

  // ── Cover Header ──
  doc.setFillColor(...colors.headerBg);
  doc.rect(0, 0, pageW, 52, 'F');

  // Decorative stripe
  doc.setFillColor(...colors.accent);
  doc.rect(0, 48, pageW, 4, 'F');

  doc.setTextColor(...colors.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('PONDWATCH', marginL, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(148, 163, 184);
  doc.text('Sensor Alert Analytics Report', marginL, 29);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${formatPHT(report.generatedAt)} (PHT)`, marginL, 38);
  doc.text(`Total Sensors Monitored: ${report.sensors.length}`, marginL, 44);

  // Right side — alert triggered count
  const triggeredCount = report.sensors.filter((s) => s.alertTriggered).length;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...(triggeredCount > 0 ? colors.accent : colors.success));
  doc.text(String(triggeredCount), pageW - marginR - 8, 28, { align: 'right' });
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.text('ACTIVE ALERTS', pageW - marginR - 8, 35, { align: 'right' });

  y = 62;

  // ── Executive Summary ──
  doc.setFillColor(...colors.light);
  doc.roundedRect(marginL, y, contentW, 28, 2, 2, 'F');
  doc.setDrawColor(...colors.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginL, y, contentW, 28, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...colors.primary);
  doc.text('EXECUTIVE SUMMARY', marginL + 6, y + 8);

  const colW = contentW / 4;
  const summaryItems = [
    { label: 'Sensors Monitored', value: String(report.sensors.length) },
    {
      label: 'Alerts Triggered',
      value: String(triggeredCount),
      highlight: triggeredCount > 0,
    },
    {
      label: 'Total Abnormal Readings',
      value: String(
        report.sensors.reduce((a, s) => a + s.abnormalReadingsInWindow, 0),
      ),
    },
    {
      label: 'Total Readings',
      value: String(
        report.sensors.reduce((a, s) => a + s.totalReadingsInWindow, 0),
      ),
    },
  ];

  summaryItems.forEach((item, i) => {
    const x = marginL + 6 + i * colW;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(
      ...(item.highlight ? colors.accent : colors.primary),
    );
    doc.text(item.value, x, y + 20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...colors.muted);
    doc.text(item.label, x, y + 25);
  });

  y += 36;

  // ── Section Title ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...colors.primary);
  doc.text('SENSOR-BY-SENSOR BREAKDOWN', marginL, y);
  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(0.5);
  doc.line(marginL, y + 2, marginL + 68, y + 2);
  y += 10;

  // ── Per-Sensor Cards ──
  for (const sensor of report.sensors) {
    checkPageBreak(60);

    const cardH = sensor.readings.length > 0 ? 72 + Math.min(sensor.readings.length, 5) * 7 : 64;
    checkPageBreak(cardH);

    // Card background
    doc.setFillColor(...colors.white);
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginL, y, contentW, cardH, 2, 2, 'FD');

    // Left accent bar
    const accentHex = SENSOR_ACCENT[sensor.sensorType] ?? '#64748b';
    const r = parseInt(accentHex.slice(1, 3), 16);
    const g = parseInt(accentHex.slice(3, 5), 16);
    const b = parseInt(accentHex.slice(5, 7), 16);
    doc.setFillColor(r, g, b);
    doc.roundedRect(marginL, y, 4, cardH, 1, 1, 'F');

    // Sensor label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...colors.text);
    doc.text(sensor.sensorLabel.toUpperCase(), marginL + 10, y + 9);

    // Alert badge
    if (sensor.alertTriggered) {
      doc.setFillColor(...colors.accent);
      doc.roundedRect(pageW - marginR - 26, y + 3, 26, 7, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...colors.white);
      doc.text('⚠ ALERT TRIGGERED', pageW - marginR - 13, y + 8, { align: 'center' });
    } else {
      doc.setFillColor(220, 252, 231);
      doc.roundedRect(pageW - marginR - 22, y + 3, 22, 7, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...colors.success);
      doc.text('✓ NORMAL', pageW - marginR - 11, y + 8, { align: 'center' });
    }

    // Divider
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.2);
    doc.line(marginL + 10, y + 13, pageW - marginR, y + 13);

    // Stats row
    const stats = [
      { label: 'Window', value: `${sensor.windowMinutes} min` },
      { label: 'Total Readings', value: String(sensor.totalReadingsInWindow) },
      {
        label: 'Abnormal',
        value: String(sensor.abnormalReadingsInWindow),
        warn: sensor.abnormalReadingsInWindow > 0,
      },
      { label: 'Threshold', value: String(sensor.thresholdToAlert) },
      { label: 'Cooldown', value: `${sensor.cooldownMinutes} min` },
    ];

    const statColW = contentW / 5;
    stats.forEach((stat, i) => {
      const x = marginL + 10 + i * statColW;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...(stat.warn ? colors.accent : colors.primary));
      doc.text(stat.value, x, y + 24);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...colors.muted);
      doc.text(stat.label, x, y + 29);
    });

    // Last Alert row
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...colors.muted);
    doc.text(
      `Last Alert: ${formatPHT(sensor.lastAlertSentAt)} (PHT)`,
      marginL + 10,
      y + 38,
    );

    // Readings table header
    if (sensor.readings.length > 0) {
      doc.setDrawColor(...colors.border);
      doc.line(marginL + 10, y + 42, pageW - marginR, y + 42);

      doc.setFillColor(...colors.light);
      doc.rect(marginL + 4, y + 43, contentW - 4, 6, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...colors.secondary);
      doc.text('TIMESTAMP (PHT)', marginL + 10, y + 47);
      doc.text('VALUE', marginL + 80, y + 47);
      doc.text('STATUS', marginL + 110, y + 47);

      const displayReadings = sensor.readings.slice(0, 5);
      displayReadings.forEach((reading, ri) => {
        const ry = y + 55 + ri * 7;
        if (ri % 2 === 0) {
          doc.setFillColor(252, 252, 253);
          doc.rect(marginL + 4, ry - 4, contentW - 4, 7, 'F');
        }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...colors.text);
        doc.text(formatShortPHT(reading.timestamp), marginL + 10, ry);
        doc.text(String(reading.value), marginL + 80, ry);

        if (reading.isAbnormal) {
          doc.setFillColor(254, 226, 226);
          doc.roundedRect(marginL + 107, ry - 3.5, 18, 5, 1, 1, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(6.5);
          doc.setTextColor(...colors.accent);
          doc.text('ABNORMAL', marginL + 116, ry, { align: 'center' });
        } else {
          doc.setFillColor(220, 252, 231);
          doc.roundedRect(marginL + 107, ry - 3.5, 14, 5, 1, 1, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(6.5);
          doc.setTextColor(...colors.success);
          doc.text('NORMAL', marginL + 114, ry, { align: 'center' });
        }
      });

      if (sensor.readings.length > 5) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7);
        doc.setTextColor(...colors.muted);
        doc.text(
          `+${sensor.readings.length - 5} more readings not shown`,
          marginL + 10,
          y + cardH - 5,
        );
      }
    } else {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(...colors.muted);
      doc.text('No readings in current window.', marginL + 10, y + 50);
    }

    y += cardH + 6;
  }

  // ── Footer on each page ──
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(...colors.headerBg);
    doc.rect(0, pageH - 12, pageW, 12, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('PondWatch — Confidential Sensor Report', marginL, pageH - 5);
    doc.text(`Page ${p} of ${totalPages}`, pageW - marginR, pageH - 5, {
      align: 'right',
    });
  }

  const filename = `pondwatch-alert-report-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

// ─── Sensor Card ──────────────────────────────────────────────────────────────

function SensorAlertCard({ sensor }: { sensor: AlertReportJson }) {
  const abnormalPct =
    sensor.totalReadingsInWindow > 0
      ? Math.round(
          (sensor.abnormalReadingsInWindow / sensor.totalReadingsInWindow) * 100,
        )
      : 0;

  return (
    <Card className="overflow-hidden">
      <div
        className="h-1 w-full"
        style={{ background: SENSOR_ACCENT[sensor.sensorType] ?? '#64748b' }}
      />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold">
            {sensor.sensorLabel}
          </CardTitle>
          <Badge
            className={`shrink-0 text-xs border ${
              sensor.alertTriggered
                ? 'bg-red-100 text-red-700 border-red-200'
                : 'bg-green-100 text-green-700 border-green-200'
            }`}
            variant="outline"
          >
            {sensor.alertTriggered ? '⚠ Alert Triggered' : '✓ Normal'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col gap-3">
        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/40 p-3">
          {[
            {
              label: 'Total Readings',
              value: sensor.totalReadingsInWindow,
              warn: false,
            },
            {
              label: 'Abnormal',
              value: sensor.abnormalReadingsInWindow,
              warn: sensor.abnormalReadingsInWindow > 0,
            },
            {
              label: 'Threshold',
              value: sensor.thresholdToAlert,
              warn: false,
            },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-0.5">
              <span
                className={`text-xl font-bold tabular-nums ${s.warn ? 'text-red-600' : 'text-foreground'}`}
              >
                {s.value}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {sensor.totalReadingsInWindow > 0 && (
          <div>
            <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
              <span>Abnormal rate</span>
              <span>{abnormalPct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted">
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${abnormalPct}%`,
                  background:
                    abnormalPct > 50
                      ? '#dc2626'
                      : abnormalPct > 20
                        ? '#ea580c'
                        : '#16a34a',
                }}
              />
            </div>
          </div>
        )}

        {/* Meta info */}
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Window</span>
            <span className="font-medium text-foreground">
              {sensor.windowMinutes} min
            </span>
          </div>
          <div className="flex justify-between">
            <span>Cooldown</span>
            <span className="font-medium text-foreground">
              {sensor.cooldownMinutes} min
            </span>
          </div>
          <div className="flex justify-between">
            <span>Last Alert</span>
            <span className="font-medium text-foreground">
              {formatPHT(sensor.lastAlertSentAt)}
            </span>
          </div>
        </div>

        {/* Recent readings */}
        {sensor.readings.length > 0 && (
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Recent Readings
            </p>
            <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
              {sensor.readings.slice(0, 8).map((r, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded px-2 py-1 text-xs ${
                    r.isAbnormal
                      ? 'bg-red-50 text-red-700'
                      : 'bg-muted/40 text-foreground'
                  }`}
                >
                  <span className="font-mono">{String(r.value)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">
                      {formatShortPHT(r.timestamp)}
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${r.isAbnormal ? 'text-red-600' : 'text-green-600'}`}
                    >
                      {r.isAbnormal ? 'ABN' : 'OK'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {sensor.readings.length === 0 && (
          <p className="text-center text-xs text-muted-foreground py-2">
            No readings in current window
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AlertAnalyticsPage() {
  const [report, setReport] = useState<FullAlertReportJson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    getSensorAlertReport()
      .then((data) => setReport(data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadPDF = async () => {
    if (!report) return;
    setPdfLoading(true);
    try {
      await generatePDF(report);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setPdfLoading(false);
    }
  };

  const triggeredCount = report?.sensors.filter((s) => s.alertTriggered).length ?? 0;

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Alert Analytics</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time sensor alert window status and abnormal reading breakdown
          </p>
          {report && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Generated: {formatPHT(report.generatedAt)} (PHT)
            </p>
          )}
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={pdfLoading || loading || !report}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pdfLoading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-4 w-4"
              >
                <path d="M12 15V3m0 12l-4-4m4 4l4-4" />
                <path d="M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" />
              </svg>
              Download PDF Report
            </>
          )}
        </button>
      </div>

      {/* Summary banner */}
      {!loading && report && (
        <div
          className={`mb-6 flex items-center gap-4 rounded-xl border px-5 py-4 ${
            triggeredCount > 0
              ? 'border-red-200 bg-red-50'
              : 'border-green-200 bg-green-50'
          }`}
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              triggeredCount > 0 ? 'bg-red-100' : 'bg-green-100'
            }`}
          >
            {triggeredCount > 0 ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#dc2626"
                strokeWidth={2}
                className="h-5 w-5"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth={2}
                className="h-5 w-5"
              >
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            )}
          </div>
          <div>
            <p
              className={`font-semibold ${triggeredCount > 0 ? 'text-red-800' : 'text-green-800'}`}
            >
              {triggeredCount > 0
                ? `${triggeredCount} sensor${triggeredCount > 1 ? 's' : ''} triggered an alert`
                : 'All sensors within normal range'}
            </p>
            <p
              className={`text-xs ${triggeredCount > 0 ? 'text-red-600' : 'text-green-600'}`}
            >
              {report.sensors.reduce(
                (a, s) => a + s.abnormalReadingsInWindow,
                0,
              )}{' '}
              total abnormal readings across {report.sensors.length} sensors in
              current monitoring windows
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-4 w-4 shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {error}
        </div>
      )}

      {/* Sensor Cards */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-5">
              <Skeleton className="mb-3 h-4 w-32" />
              <Skeleton className="mb-2 h-16 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-3/4" />
            </Card>
          ))}
        </div>
      ) : report ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {report.sensors.map((sensor) => (
            <SensorAlertCard key={sensor.sensorType} sensor={sensor} />
          ))}
        </div>
      ) : null}
    </div>
  );
}