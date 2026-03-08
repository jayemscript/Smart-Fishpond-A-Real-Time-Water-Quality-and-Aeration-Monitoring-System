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
  const mL = 22; // left margin
  const mR = 22; // right margin
  const cW = pageW - mL - mR; // content width = 166mm
  let y = 0;

  // ── Monochrome academic palette ──
  const C = {
    black: [10, 10, 10] as [number, number, number],
    dark: [40, 40, 40] as [number, number, number],
    mid: [90, 90, 90] as [number, number, number],
    light: [160, 160, 160] as [number, number, number],
    rule: [180, 180, 180] as [number, number, number],
    bg: [245, 245, 245] as [number, number, number],
    white: [255, 255, 255] as [number, number, number],
    alert: [60, 60, 60] as [number, number, number], // dark grey for alert (no red)
  };

  const hRule = () => {
    doc.setDrawColor(...C.rule);
    doc.setLineWidth(0.25);
    doc.line(mL, y, pageW - mR, y);
  };

  const thickRule = () => {
    doc.setDrawColor(...C.black);
    doc.setLineWidth(0.6);
    doc.line(mL, y, pageW - mR, y);
  };

  function needsPage(h: number) {
    if (y + h > pageH - 18) {
      doc.addPage();
      y = 22;
    }
  }

  // ══════════════════════════════════════════════════
  // PAGE HEADER (repeated per page via footer loop)
  // ══════════════════════════════════════════════════

  // ── Title block ──
  y = 18;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...C.mid);
  doc.text('PONDWATCH MONITORING SYSTEM', mL, y);
  doc.text('SENSOR ALERT ANALYTICS REPORT', pageW - mR, y, { align: 'right' });

  y += 3;
  thickRule();
  y += 1;

  doc.setFillColor(...C.black);
  doc.rect(mL, y, cW, 0.5, 'F');
  y += 5;

  // Report title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...C.black);
  doc.text('Sensor Alert Report', mL, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...C.mid);
  doc.text(`Report ID: RPT-${Date.now().toString(36).toUpperCase()}`, mL, y);
  doc.text(`Generated: ${formatPHT(report.generatedAt)} (PHT)`, pageW - mR, y, {
    align: 'right',
  });
  y += 6;

  hRule();
  y += 8;

  // ══════════════════════════════════════════════════
  // SECTION 1 — Report Metadata table
  // ══════════════════════════════════════════════════

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.mid);
  doc.text('1.  REPORT METADATA', mL, y);
  y += 4;
  hRule();
  y += 5;

  const triggeredCount = report.sensors.filter((s) => s.alertTriggered).length;
  const totalAbnormal = report.sensors.reduce(
    (a, s) => a + s.abnormalReadingsInWindow,
    0,
  );
  const totalReadings = report.sensors.reduce(
    (a, s) => a + s.totalReadingsInWindow,
    0,
  );

  const metaRows = [
    ['Report Title', report.reportTitle],
    ['Generated At', `${formatPHT(report.generatedAt)} (Philippine Time)`],
    ['Sensors Monitored', String(report.sensors.length)],
    [
      'Alerts Triggered',
      `${triggeredCount} of ${report.sensors.length} sensors`,
    ],
    ['Total Readings (all windows)', String(totalReadings)],
    ['Total Abnormal Readings', String(totalAbnormal)],
  ];

  const col1W = 60;
  metaRows.forEach(([label, value], i) => {
    if (i % 2 === 0) {
      doc.setFillColor(...C.bg);
      doc.rect(mL, y - 3.5, cW, 6, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...C.dark);
    doc.text(label, mL + 2, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.black);
    doc.text(value, mL + col1W, y);
    y += 6;
  });

  y += 4;
  hRule();
  y += 10;

  // ══════════════════════════════════════════════════
  // SECTION 2 — Summary table
  // ══════════════════════════════════════════════════

  needsPage(40);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.mid);
  doc.text('2.  ALERT SUMMARY TABLE', mL, y);
  y += 4;
  hRule();
  y += 5;

  // Table header
  const c1 = mL,
    c2 = mL + 50,
    c3 = mL + 82,
    c4 = mL + 106,
    c5 = mL + 130,
    c6 = mL + 150;

  doc.setFillColor(...C.dark);
  doc.rect(mL, y - 3.5, cW, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...C.white);
  doc.text('Sensor', c1 + 2, y);
  doc.text('Window', c2, y);
  doc.text('Readings', c3, y);
  doc.text('Abnormal', c4, y);
  doc.text('Threshold', c5, y);
  doc.text('Status', c6, y);
  y += 6;

  report.sensors.forEach((s, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(...C.bg);
      doc.rect(mL, y - 3.5, cW, 6, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.black);
    doc.text(s.sensorLabel, c1 + 2, y);
    doc.text(`${s.windowMinutes} min`, c2, y);
    doc.text(String(s.totalReadingsInWindow), c3, y);

    // Abnormal col — bold if > 0
    if (s.abnormalReadingsInWindow > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...C.dark);
    }
    doc.text(String(s.abnormalReadingsInWindow), c4, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.black);

    doc.text(String(s.thresholdToAlert), c5, y);

    // Status
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    if (s.alertTriggered) {
      doc.setFillColor(...C.alert);
      doc.rect(c6 - 1, y - 3.5, 22, 5, 'F');
      doc.setTextColor(...C.white);
      doc.text('TRIGGERED', c6 + 10, y - 0.5, { align: 'center' });
    } else {
      doc.setFillColor(...C.rule);
      doc.rect(c6 - 1, y - 3.5, 18, 5, 'F');
      doc.setTextColor(...C.dark);
      doc.text('NORMAL', c6 + 8, y - 0.5, { align: 'center' });
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.black);
    y += 6;
  });

  // Bottom border of table
  doc.setDrawColor(...C.dark);
  doc.setLineWidth(0.4);
  doc.line(mL, y, pageW - mR, y);
  y += 10;

  // ══════════════════════════════════════════════════
  // SECTION 3 — Per-sensor detail
  // ══════════════════════════════════════════════════

  needsPage(20);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.mid);
  doc.text('3.  SENSOR DETAIL RECORDS', mL, y);
  y += 4;
  hRule();
  y += 8;

  report.sensors.forEach((sensor, sIdx) => {
    needsPage(55);

    // Sensor subsection heading
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...C.black);
    doc.text(`3.${sIdx + 1}  ${sensor.sensorLabel}`, mL, y);

    // Status tag (right-aligned, text only)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(sensor.alertTriggered ? 30 : 100, 30, 30);
    doc.text(
      sensor.alertTriggered ? '[ALERT TRIGGERED]' : '[NORMAL]',
      pageW - mR,
      y,
      { align: 'right' },
    );

    y += 3;
    doc.setDrawColor(...C.dark);
    doc.setLineWidth(0.3);
    doc.line(mL, y, pageW - mR, y);
    y += 5;

    // Parameter table for this sensor (2-col layout)
    const paramRows: [string, string][] = [
      ['Sensor Type', sensor.sensorType],
      ['Monitoring Window', `${sensor.windowMinutes} minute(s)`],
      ['Cooldown Period', `${sensor.cooldownMinutes} minute(s)`],
      ['Alert Threshold', `${sensor.thresholdToAlert} abnormal readings`],
      ['Total Readings (window)', String(sensor.totalReadingsInWindow)],
      [
        'Abnormal Readings',
        `${sensor.abnormalReadingsInWindow} (${sensor.totalReadingsInWindow > 0 ? Math.round((sensor.abnormalReadingsInWindow / sensor.totalReadingsInWindow) * 100) : 0}%)`,
      ],
      ['Alert Triggered', sensor.alertTriggered ? 'Yes' : 'No'],
      ['Last Alert Sent', formatPHT(sensor.lastAlertSentAt)],
    ];

    paramRows.forEach(([label, val], pi) => {
      if (pi % 2 === 0) {
        doc.setFillColor(...C.bg);
        doc.rect(mL, y - 3.2, cW, 5.5, 'F');
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...C.mid);
      doc.text(label, mL + 2, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...C.black);
      // Bold the value if it's abnormal readings > 0
      if (
        label === 'Abnormal Readings' &&
        sensor.abnormalReadingsInWindow > 0
      ) {
        doc.setFont('helvetica', 'bold');
      }
      doc.text(val, mL + col1W, y);
      doc.setFont('helvetica', 'normal');
      y += 5.5;
    });

    y += 4;

    // Readings table
    if (sensor.readings.length > 0) {
      needsPage(20);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...C.mid);
      doc.text('Observation Log (most recent readings):', mL + 2, y);
      y += 4;

      // Table header
      const rC1 = mL,
        rC2 = mL + 68,
        rC3 = mL + 130;

      doc.setFillColor(...C.mid);
      doc.rect(mL, y - 3, cW, 5.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(...C.white);
      doc.text('Timestamp (PHT)', rC1 + 2, y);
      doc.text('Value', rC2, y);
      doc.text('Classification', rC3, y);
      y += 5;

      const showReadings = sensor.readings.slice(0, 10);
      showReadings.forEach((reading, ri) => {
        needsPage(7);
        if (ri % 2 === 0) {
          doc.setFillColor(...C.bg);
          doc.rect(mL, y - 3, cW, 5.5, 'F');
        }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...C.black);
        doc.text(formatShortPHT(reading.timestamp), rC1 + 2, y);
        doc.text(String(reading.value), rC2, y);

        doc.setFont('helvetica', reading.isAbnormal ? 'bold' : 'normal');
        doc.setTextColor(reading.isAbnormal ? 30 : 100, 30, 30);
        doc.text(reading.isAbnormal ? 'ABNORMAL' : 'Normal', rC3, y);

        doc.setTextColor(...C.black);
        doc.setFont('helvetica', 'normal');
        y += 5.5;
      });

      // Bottom rule of readings table
      doc.setDrawColor(...C.rule);
      doc.setLineWidth(0.25);
      doc.line(mL, y, pageW - mR, y);
      y += 3;

      if (sensor.readings.length > 10) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7);
        doc.setTextColor(...C.light);
        doc.text(
          `Note: ${sensor.readings.length - 10} additional readings omitted from this report.`,
          mL + 2,
          y,
        );
        y += 5;
      }
    } else {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(...C.light);
      doc.text(
        'No observations recorded in the current monitoring window.',
        mL + 2,
        y,
      );
      y += 6;
    }

    y += 8;
  });

  // ══════════════════════════════════════════════════
  // FOOTER — every page
  // ══════════════════════════════════════════════════

  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    // Bottom rule
    doc.setDrawColor(...C.rule);
    doc.setLineWidth(0.25);
    doc.line(mL, pageH - 14, pageW - mR, pageH - 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...C.light);
    doc.text(
      `PondWatch Monitoring System  |  Sensor Alert Report  |  ${formatPHT(report.generatedAt)} (PHT)`,
      mL,
      pageH - 9,
    );
    doc.text(`Page ${p} / ${totalPages}`, pageW - mR, pageH - 9, {
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
          (sensor.abnormalReadingsInWindow / sensor.totalReadingsInWindow) *
            100,
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

  const triggeredCount =
    report?.sensors.filter((s) => s.alertTriggered).length ?? 0;

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Alert Analytics
          </h2>
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
