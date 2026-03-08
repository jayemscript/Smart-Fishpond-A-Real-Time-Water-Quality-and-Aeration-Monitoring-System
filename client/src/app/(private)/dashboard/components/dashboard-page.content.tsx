'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { formatDate } from '@syntaxsentinel/date-utils';
import { extractErrorMessage } from '@/configs/api.helper';
import {
  GetDashboardOverview,
  GetAllSensorsTimeSeries,
  GetDoStatusDistribution,
  GetPhStatusDistribution,
  GetWaterLevelStatusDistribution,
  GetAlertSummary,
} from '@/api/protected/sensor-logs/sensor-logs.api';
import {
  TimeRange,
  DashboardOverviewResponse,
  AllSensorsTimeSeriesResponse,
  StatusDistributionResponse,
  AlertSummaryResponse,
} from '@/api/protected/sensor-logs/sensor-interface.api';
import AlertAnalyticsPage from './alert-analytics-page'

// ─── Types ────────────────────────────────────────────────────────────────────

type RangeOption = { label: string; value: TimeRange };

// ─── Constants ────────────────────────────────────────────────────────────────

const RANGES: RangeOption[] = [
  { label: '1H', value: '1h' },
  { label: '6H', value: '6h' },
  { label: '24H', value: '24h' },
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
];

const STATUS_COLORS: Record<string, string> = {
  normal: 'var(--chart-1)',
  low: 'var(--chart-2)',
  high: 'var(--chart-3)',
  critical: 'var(--destructive)',
  acidic: '#f59e0b',
  alkaline: 'var(--chart-4)',
  full: 'var(--chart-1)',
  empty: 'var(--destructive)',
  low_level: 'var(--chart-2)',
};

const LINE_COLORS = {
  dissolvedOxygen: 'var(--chart-1)',
  ph: 'var(--chart-2)',
  temperature: 'var(--chart-3)',
};

// ─── Sensor meta: descriptions + thresholds shown to users ───────────────────

const SENSOR_META = {
  dissolvedOxygen: {
    title: 'Dissolved Oxygen',
    unit: 'mg/L',
    description:
      'Amount of oxygen dissolved in the water. Fish need at least 5–6 mg/L to survive. Below 4 mg/L is critical and can cause mass fish death.',
    thresholds: '< 4 critical · 4–6 low · 6–10 normal · > 10 high',
  },
  ph: {
    title: 'pH Level',
    unit: 'pH',
    description:
      'Measures how acidic or alkaline the water is. The ideal range for most freshwater fish is 6.5–8.5. Values outside this range stress fish and reduce immunity.',
    thresholds: '< 6.5 acidic · 6.5–8.5 normal · > 8.5 alkaline',
  },
  temperature: {
    title: 'Temperature',
    unit: '°C',
    description:
      'Water temperature directly affects fish metabolism, feeding, and oxygen absorption. Most freshwater fish thrive between 25–32 °C.',
    thresholds: '< 25 cold · 25–32 optimal · > 32 hot',
  },
  waterLevel: {
    title: 'Water Level',
    unit: '',
    description:
      'Current water level in the pond. Low levels can concentrate toxins and reduce oxygen. High levels may overflow and cause fish loss.',
    thresholds: 'low · normal · high',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimeTick(iso: string, range: TimeRange): string {
  const d = new Date(iso);
  if (range === '7d' || range === '30d') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function statusBadgeVariant(status: string | null | undefined) {
  if (!status) return 'secondary';
  if (status === 'critical') return 'destructive';
  if (status === 'normal') return 'default';
  return 'secondary';
}

// ─── Error Banner ─────────────────────────────────────────────────────────────

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
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
      <span>{message}</span>
    </div>
  );
}

// ─── Range Picker ─────────────────────────────────────────────────────────────

function RangePicker({
  value,
  onChange,
}: {
  value: TimeRange;
  onChange: (r: TimeRange) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      {RANGES.map((r) => (
        <button
          key={r.value}
          onClick={() => onChange(r.value)}
          className={`rounded-md px-3 py-1 text-xs font-semibold transition-all duration-200 ${
            value === r.value
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

// ─── Info Tooltip Icon ────────────────────────────────────────────────────────

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-3.5 w-3.5"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

// ─── Description Box ─────────────────────────────────────────────────────────

function DescriptionBox({
  text,
  thresholds,
}: {
  text: string;
  thresholds?: string;
}) {
  return (
    <div className="mt-2 rounded-lg bg-muted/50 px-3 py-2.5">
      <div className="flex gap-1.5 text-xs text-muted-foreground leading-relaxed">
        <span className="mt-0.5 shrink-0 text-primary">
          <InfoIcon />
        </span>
        <div className="flex flex-col gap-1">
          <span>{text}</span>
          {thresholds && (
            <span className="font-mono text-[10px] text-muted-foreground/70">
              {thresholds}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  title,
  unit,
  description,
  thresholds,
  value,
  status,
  stats,
  icon,
  loading,
}: {
  title: string;
  unit?: string;
  description: string;
  thresholds?: string;
  value: string | number | null | undefined;
  status?: string | null;
  stats?: { min: number; max: number; mean: number } | null;
  icon: React.ReactNode;
  loading: boolean;
}) {
  if (loading) {
    return (
      <Card className="flex flex-col gap-3 p-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-16 w-full" />
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden transition-shadow duration-200 hover:shadow-md">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary/60 to-primary/10" />
      <CardContent className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {title}
            </span>
            <div className="flex items-end gap-1.5">
              <span className="text-3xl font-bold tabular-nums text-foreground">
                {value ?? '—'}
              </span>
              {unit && (
                <span className="mb-1 text-sm text-muted-foreground">
                  {unit}
                </span>
              )}
            </div>
            {status ? (
              <Badge
                variant={statusBadgeVariant(status)}
                className="w-fit capitalize text-xs"
              >
                {status}
              </Badge>
            ) : (
              !value && (
                <span className="text-[10px] text-muted-foreground">
                  No data available
                </span>
              )
            )}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
            {icon}
          </div>
        </div>

        {/* 24h stats */}
        {stats && (
          <div className="mt-3">
            <p className="mb-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Last 24 hours
            </p>
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/60 p-2">
              {[
                { label: 'Min', val: stats.min },
                { label: 'Avg', val: stats.mean },
                { label: 'Max', val: stats.max },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center">
                  <span className="text-[10px] text-muted-foreground">
                    {s.label}
                  </span>
                  <span className="text-sm font-semibold tabular-nums">
                    {s.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <DescriptionBox text={description} thresholds={thresholds} />
      </CardContent>
    </Card>
  );
}

// ─── Custom Chart Tooltip ─────────────────────────────────────────────────────

function ChartTooltip({
  active,
  payload,
  label,
  range,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  range: TimeRange;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-xs">
      <p className="mb-1 font-medium text-muted-foreground">
        {label ? formatTimeTick(label, range) : ''}
      </p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="capitalize text-foreground">
            {p.name}: <strong>{p.value}</strong>
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Chart Empty State ────────────────────────────────────────────────────────

function ChartEmpty({
  message = 'No data for this period',
}: {
  message?: string;
}) {
  return (
    <div className="flex h-56 flex-col items-center justify-center gap-2 rounded-lg bg-muted/30 text-xs text-muted-foreground">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-8 w-8 opacity-40"
      >
        <path d="M3 3v18h18" />
        <path d="M7 16l4-4 4 4 4-4" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

// ─── Pie Empty State ──────────────────────────────────────────────────────────

function PieEmpty() {
  return (
    <div className="flex h-40 flex-col items-center justify-center gap-1 text-xs text-muted-foreground">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6 opacity-40"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
      No data for this period
    </div>
  );
}

// ─── Alert List ───────────────────────────────────────────────────────────────

function AlertList({
  title,
  description,
  count,
  items,
  loading,
}: {
  title: string;
  description: string;
  count: number;
  items?: { label: string; status: string; time: string; sensorId: string }[];
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <CardTitle className="text-sm">{title}</CardTitle>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
          {!loading && (
            <Badge
              variant={count > 0 ? 'destructive' : 'secondary'}
              className="shrink-0 text-xs"
            >
              {count} alert{count !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : !items?.length ? (
          <div className="flex h-20 items-center justify-center rounded-lg bg-muted/40 text-xs text-muted-foreground">
            ✓ No alerts in this period
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-xs"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">
                    {item.label}
                  </span>
                  <span className="text-muted-foreground">{item.sensorId}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge
                    variant={statusBadgeVariant(item.status)}
                    className="capitalize text-[10px]"
                  >
                    {item.status}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(item.time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardPageContent() {
  const { user } = useAuthCheck();
  const [range, setRange] = useState<TimeRange>('24h');

  const [overview, setOverview] = useState<DashboardOverviewResponse | null>(
    null,
  );
  const [timeSeries, setTimeSeries] =
    useState<AllSensorsTimeSeriesResponse | null>(null);
  const [doStatus, setDoStatus] = useState<StatusDistributionResponse | null>(
    null,
  );
  const [phStatus, setPhStatus] = useState<StatusDistributionResponse | null>(
    null,
  );
  const [waterStatus, setWaterStatus] =
    useState<StatusDistributionResponse | null>(null);
  const [alerts, setAlerts] = useState<AlertSummaryResponse | null>(null);

  const [overviewLoading, setOverviewLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [chartsError, setChartsError] = useState<string | null>(null);

  useEffect(() => {
    setOverviewError(null);
    GetDashboardOverview()
      .then(setOverview)
      .catch((err) => setOverviewError(extractErrorMessage(err)))
      .finally(() => setOverviewLoading(false));
  }, []);

  const fetchRangeData = useCallback(async (r: TimeRange) => {
    setChartsLoading(true);
    setChartsError(null);
    try {
      const [ts, ds, ps, ws, al] = await Promise.all([
        GetAllSensorsTimeSeries(r),
        GetDoStatusDistribution(r),
        GetPhStatusDistribution(r),
        GetWaterLevelStatusDistribution(r),
        GetAlertSummary(r),
      ]);
      setTimeSeries(ts);
      setDoStatus(ds);
      setPhStatus(ps);
      setWaterStatus(ws);
      setAlerts(al);
    } catch (err) {
      setChartsError(extractErrorMessage(err));
    } finally {
      setChartsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRangeData(range);
  }, [range, fetchRangeData]);

  const sensors = overview?.data?.sensors;

  const mergedSeries = React.useMemo(() => {
    if (!timeSeries?.data?.series) return [];
    const { dissolvedOxygen, ph, temperature } = timeSeries.data.series;
    const map = new Map<string, Record<string, number>>();
    dissolvedOxygen?.forEach((p) => {
      if (!map.has(p.time)) map.set(p.time, {});
      map.get(p.time)!.dissolvedOxygen = p.value;
    });
    ph?.forEach((p) => {
      if (!map.has(p.time)) map.set(p.time, {});
      map.get(p.time)!.ph = p.value;
    });
    temperature?.forEach((p) => {
      if (!map.has(p.time)) map.set(p.time, {});
      map.get(p.time)!.temperature = p.value;
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, vals]) => ({ time, ...vals }));
  }, [timeSeries]);

  return (
    <div className="min-h-screen p-6">

      {/* ── Header ── */}
      <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold capitalize text-foreground">
            Welcome back, {user?.username || 'User'}
          </h2>
          <div className="mt-1 flex flex-col text-sm text-muted-foreground sm:flex-row sm:gap-2">
            <span>Fishpond monitoring overview</span>
            <span className="hidden sm:inline">·</span>
            <span>as of {formatDate.longDate(new Date())}</span>
          </div>
        </div>
        <RangePicker value={range} onChange={setRange} />
      </div>

      {overviewError && (
        <div className="mb-4">
          <ErrorBanner message={overviewError} />
        </div>
      )}
      <AlertAnalyticsPage />

      {/* ── Stat Cards ── */}
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-foreground">
          Current Readings
        </h3>
        <p className="text-xs text-muted-foreground">
          Latest sensor values from the pond. The min/avg/max row shows the
          range over the last 24 hours.
        </p>
      </div>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          {...SENSOR_META.dissolvedOxygen}
          value={sensors?.dissolvedOxygen?.latest?.value as number}
          status={sensors?.dissolvedOxygen?.latest?.status}
          stats={sensors?.dissolvedOxygen?.stats24h}
          loading={overviewLoading}
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M8 12h8M12 8v8" />
            </svg>
          }
        />
        <StatCard
          {...SENSOR_META.ph}
          value={sensors?.ph?.latest?.value as number}
          status={sensors?.ph?.latest?.status}
          stats={sensors?.ph?.stats24h}
          loading={overviewLoading}
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
            </svg>
          }
        />
        <StatCard
          {...SENSOR_META.temperature}
          unit={sensors?.temperature?.latest?.unit ?? '°C'}
          value={sensors?.temperature?.latest?.value as number}
          status={sensors?.temperature?.latest?.status}
          stats={sensors?.temperature?.stats24h}
          loading={overviewLoading}
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" />
            </svg>
          }
        />
        <StatCard
          {...SENSOR_META.waterLevel}
          value={sensors?.waterLevel?.latest?.value as string}
          status={sensors?.waterLevel?.latest?.status}
          loading={overviewLoading}
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path d="M12 2L4 9.5C4 14.09 7.58 18 12 18s8-3.91 8-8.5L12 2z" />
            </svg>
          }
        />
      </div>

      {chartsError && (
        <div className="mb-4">
          <ErrorBanner message={chartsError} />
        </div>
      )}

      {/* ── Multi-Sensor Line Chart ── */}
      <div className="mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Sensor Trends Over Time</CardTitle>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Shows how dissolved oxygen (DO), pH, and water temperature have
              changed over the selected time range. Use this to spot patterns —
              for example, DO tends to drop at night when plants stop producing
              oxygen, and temperature spikes during midday heat can stress fish.
            </p>
            <DescriptionBox
              text="Each line represents the average sensor value per time bucket. Hover over any point to see exact values."
              thresholds="Green = DO (mg/L) · Teal = pH · Olive = Temperature (°C)"
            />
          </CardHeader>
          <CardContent>
            {chartsLoading ? (
              <Skeleton className="h-64 w-full rounded-lg" />
            ) : mergedSeries.length === 0 ? (
              <ChartEmpty />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={mergedSeries}
                  margin={{ top: 4, right: 16, left: -8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="time"
                    tickFormatter={(v) => formatTimeTick(v, range)}
                    tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<ChartTooltip range={range} />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="dissolvedOxygen"
                    name="DO (mg/L)"
                    stroke={LINE_COLORS.dissolvedOxygen}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ph"
                    name="pH"
                    stroke={LINE_COLORS.ph}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    name="Temp (°C)"
                    stroke={LINE_COLORS.temperature}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Status Distribution ── */}
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-foreground">
          Status Distribution
        </h3>
        <p className="text-xs text-muted-foreground">
          Breakdown of how often each sensor was in a given status during the
          selected period. A healthy pond should be mostly "normal" (green).
        </p>
      </div>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* DO Status Pie */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-sm">Dissolved Oxygen Status</CardTitle>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Shows the proportion of DO readings that were critical, low,
              normal, or high. A large red slice means your pond had dangerously
              low oxygen for an extended period — check your aerator
              immediately.
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            {chartsLoading ? (
              <div className="flex h-48 items-center justify-center">
                <Skeleton className="h-40 w-40 rounded-full" />
              </div>
            ) : !doStatus?.data?.distribution?.length ? (
              <PieEmpty />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={doStatus.data.distribution}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {doStatus.data.distribution.map((entry, i) => (
                      <Cell
                        key={entry.status}
                        fill={
                          STATUS_COLORS[entry.status] ??
                          `hsl(${(i * 60) % 360}, 65%, 55%)`
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number, n: string) => [`${v} readings`, n]}
                    contentStyle={{
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 12,
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* pH Status Pie */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-sm">pH Status</CardTitle>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Shows how acidic or alkaline the water was over the period. Mostly
              "normal" is ideal. Frequent "acidic" readings may indicate
              overfeeding or poor aeration; "alkaline" may indicate algae bloom
              or hard water.
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            {chartsLoading ? (
              <div className="flex h-48 items-center justify-center">
                <Skeleton className="h-40 w-40 rounded-full" />
              </div>
            ) : !phStatus?.data?.distribution?.length ? (
              <PieEmpty />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={phStatus.data.distribution}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {phStatus.data.distribution.map((entry, i) => (
                      <Cell
                        key={entry.status}
                        fill={
                          STATUS_COLORS[entry.status] ??
                          `hsl(${(i * 60) % 360}, 65%, 55%)`
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number, n: string) => [`${v} readings`, n]}
                    contentStyle={{
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 12,
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Water Level Status Pie */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-sm">Water Level Status</CardTitle>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tracks how often the water level was low, normal, or high.
              Persistent low levels concentrate waste and reduce oxygen
              capacity. High levels risk overflow and fish escaping the pond.
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            {chartsLoading ? (
              <div className="flex h-48 items-center justify-center">
                <Skeleton className="h-40 w-40 rounded-full" />
              </div>
            ) : !waterStatus?.data?.distribution?.length ? (
              <PieEmpty />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={waterStatus.data.distribution}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {waterStatus.data.distribution.map((entry, i) => (
                      <Cell
                        key={entry.status}
                        fill={
                          STATUS_COLORS[entry.status] ??
                          `hsl(${(i * 60) % 360}, 65%, 55%)`
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number, n: string) => [`${v} readings`, n]}
                    contentStyle={{
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 12,
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Alerts Panel ── */}
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-foreground">Recent Alerts</h3>
        <p className="text-xs text-muted-foreground">
          All sensor readings that fell outside the safe range during the
          selected period. These require your attention. Adjust the time range
          above to see older alerts.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AlertList
          title="Dissolved Oxygen Alerts"
          description="Readings where DO dropped below 6 mg/L (low) or 4 mg/L (critical). Critical levels can kill fish within hours."
          count={alerts?.data?.totals?.dissolvedOxygen ?? 0}
          items={alerts?.data?.alerts?.dissolvedOxygen
            ?.slice(0, 5)
            .map((a) => ({
              label: `${a.value} mg/L`,
              status: a.status,
              time: a.timestamp,
              sensorId: a.sensorId,
            }))}
          loading={chartsLoading}
        />
        <AlertList
          title="pH Level Alerts"
          description="Readings where pH went below 6.5 (acidic) or above 8.5 (alkaline). Both extremes damage fish gills and reduce immunity."
          count={alerts?.data?.totals?.ph ?? 0}
          items={alerts?.data?.alerts?.ph
            ?.slice(0, 5)
            .map((a) => ({
              label: `${a.value} pH`,
              status: a.status,
              time: a.timestamp,
              sensorId: a.sensorId,
            }))}
          loading={chartsLoading}
        />
        <AlertList
          title="Water Level Alerts"
          description="Readings where water level was not at the normal range. Low levels stress fish; high levels risk overflow."
          count={alerts?.data?.totals?.waterLevel ?? 0}
          items={alerts?.data?.alerts?.waterLevel
            ?.slice(0, 5)
            .map((a) => ({
              label: a.level,
              status: a.status,
              time: a.timestamp,
              sensorId: a.sensorId,
            }))}
          loading={chartsLoading}
        />
      </div>
    </div>
  );
}
