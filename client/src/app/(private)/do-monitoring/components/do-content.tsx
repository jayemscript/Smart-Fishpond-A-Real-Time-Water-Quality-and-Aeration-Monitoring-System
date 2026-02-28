'use client';

import React, { useContext, useEffect, useState, useMemo } from 'react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { SocketContext } from '@/providers/socket-provider';
import {
  startPhWaterSimulation,
  stopPhWaterSimulation,
} from '@/api/protected/do-api/do-sensor.api';
import { DoData } from '@/api/protected/do-api/do-sensor.interface';
import { showToastSuccess, showToastError } from '@/utils/toast-config';
import { extractErrorMessage } from '@/configs/api.helper';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Waves,
  Activity,
  Clock,
  WifiOff,
  Play,
  Square,
  Loader2,
  Wind,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDate } from '@syntaxsentinel/date-utils';
import { useRouter } from 'next/navigation';

const chartConfig = {
  doLevel: {
    label: 'DO Level',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

// DO thresholds in mg/L
const DO_LOW = 4;
const DO_HIGH = 8;

function getDoStatus(value: number): 'low' | 'normal' | 'high' {
  if (value < DO_LOW) return 'low';
  if (value > DO_HIGH) return 'high';
  return 'normal';
}

export default function DOContent() {
  const router = useRouter();
  const { socket } = useContext(SocketContext);
  const [currentDo, setCurrentDo] = useState<DoData | null>(null);
  const [doHistory, setDoHistory] = useState<DoData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState<'low' | 'normal' | 'high'>('normal');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  const chartData = useMemo(() => {
    return doHistory
      .slice()
      .reverse()
      .map((reading, index) => ({
        timestamp: formatDate.readableDateTime(reading.timestamp),
        doLevel: Number(reading.oxygenLevel),
        index,
      }));
  }, [doHistory]);

  useEffect(() => {
    if (!socket) return;

    setIsConnected(socket.connected);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    const handleDoData = (data: DoData) => {
      const doData: DoData = {
        ...data,
        timestamp: new Date(data.timestamp),
      };

      setCurrentDo(doData);
      setDoHistory((prev) => [doData, ...prev].slice(0, 20));
      setIsSimulationRunning(true);
      setStatus(getDoStatus(doData.oxygenLevel));
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('sensor:dissolvedOxygen', handleDoData);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('sensor:dissolvedOxygen', handleDoData);
    };
  }, [socket]);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await startPhWaterSimulation();
      setIsSimulationRunning(true);
      showToastSuccess(
        'Monitoring Started',
        res.message || 'Dissolved oxygen monitoring started successfully',
        'bottom-right',
      );
    } catch (error: unknown) {
      showToastError(
        'Operation Failed',
        extractErrorMessage(error),
        'bottom-right',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      const res = await stopPhWaterSimulation();
      setIsSimulationRunning(false);
      showToastSuccess(
        'Monitoring Stopped',
        res.message || 'Dissolved oxygen monitoring stopped',
        'bottom-right',
      );
    } catch (error: unknown) {
      showToastError(
        'Operation Failed',
        extractErrorMessage(error),
        'bottom-right',
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'low':
        return 'text-red-500';
      case 'high':
        return 'text-blue-500';
      case 'normal':
        return 'text-primary';
    }
  };

  const getStatusBadgeVariant = (): 'default' | 'secondary' | 'destructive' => {
    switch (status) {
      case 'low':
        return 'destructive';
      case 'high':
        return 'secondary';
      case 'normal':
        return 'default';
    }
  };

  if (!socket || !isConnected) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Alert variant="destructive">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            WebSocket disconnected. Please check your connection.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dissolved Oxygen Monitoring
          </h1>
          <p className="text-muted-foreground">
            Real-time fishpond dissolved oxygen level tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => router.push('/do-monitoring/logs')}>
            View Logs
          </Button>

          <Badge
            variant={isConnected ? 'default' : 'destructive'}
            className="h-8"
          >
            <Activity className="w-3 h-3 mr-1" />
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
          {isSimulationRunning ? (
            <Button
              onClick={handleStop}
              disabled={loading}
              variant="destructive"
              size="lg"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Square className="w-4 h-4 mr-2" />
              )}
              Stop Monitoring
            </Button>
          ) : (
            <Button
              onClick={handleStart}
              disabled={loading}
              variant="default"
              size="lg"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Start Monitoring
            </Button>
          )}
        </div>
      </div>

      {/* Main DO Display */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="w-5 h-5" />
            Current Dissolved Oxygen Level
          </CardTitle>
          <CardDescription>Fishpond dissolved oxygen sensor</CardDescription>
        </CardHeader>
        <CardContent>
          {currentDo ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className={`text-6xl max-sm:text-2xl font-bold ${getStatusColor()}`}
                  >
                    {currentDo.oxygenLevel} {currentDo.unit}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatDate.timeOnly(currentDo.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={getStatusBadgeVariant()} className="mb-2">
                    {status.toUpperCase()}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {currentDo.sensorId}
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Low</div>
                  <div className="text-lg font-semibold text-red-500">
                    &lt; 4 mg/L
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">
                    Optimal Range
                  </div>
                  <div className="text-lg font-semibold text-primary">
                    4 – 8 mg/L
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">High</div>
                  <div className="text-lg font-semibold text-blue-500">
                    &gt; 8 mg/L
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Waves className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Waiting for dissolved oxygen data...</p>
              <p className="text-sm mt-2">
                Click &quot;Start Monitoring&quot; to begin monitoring
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DO Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            DO Level Trend
          </CardTitle>
          <CardDescription>
            Real-time dissolved oxygen visualization (last 20 readings)
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          {chartData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[150px] w-full"
            >
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{ left: 12, right: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="timestamp"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[200px]"
                      formatter={(value) => {
                        const do_ = Number(value);
                        return [`${do_.toFixed(2)} mg/L`, 'DO Level'];
                      }}
                    />
                  }
                />
                <Line
                  dataKey="doLevel"
                  type="monotone"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6, fill: '#1d4ed8' }}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No data available for chart</p>
              <p className="text-sm mt-2">
                Start monitoring to see DO level trends
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DO History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Readings
          </CardTitle>
          <CardDescription>
            Last 20 dissolved oxygen measurements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {doHistory.length > 0 ? (
            <div
              className="overflow-y-auto"
              style={{ maxHeight: '30vh', minHeight: '200px' }}
            >
              <div className="space-y-2">
                {doHistory.map((reading, index) => {
                  const s = getDoStatus(reading.oxygenLevel);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Wind className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold max-sm:text-sm">
                          {reading.oxygenLevel} {reading.unit}
                        </span>
                        <Badge
                          variant={
                            s === 'low'
                              ? 'destructive'
                              : s === 'high'
                                ? 'secondary'
                                : 'default'
                          }
                          className="text-xs"
                        >
                          {s.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="max-sm:text-[0.7em]">
                          {formatDate.readableDateTime(reading.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No dissolved oxygen history available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average DO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {doHistory.length > 0
                ? (
                    doHistory.reduce((sum, r) => sum + r.oxygenLevel, 0) /
                    doHistory.length
                  ).toFixed(2)
                : '0.00'}{' '}
              <span className="text-base font-normal text-muted-foreground">
                mg/L
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Highest DO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {doHistory.length > 0
                ? Math.max(...doHistory.map((r) => r.oxygenLevel)).toFixed(2)
                : '0.00'}{' '}
              <span className="text-base font-normal text-muted-foreground">
                mg/L
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Lowest DO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {doHistory.length > 0
                ? Math.min(...doHistory.map((r) => r.oxygenLevel)).toFixed(2)
                : '0.00'}{' '}
              <span className="text-base font-normal text-muted-foreground">
                mg/L
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
