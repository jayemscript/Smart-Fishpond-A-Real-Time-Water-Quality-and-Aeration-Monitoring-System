'use client';

import React, { useContext, useEffect, useState, useMemo } from 'react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { SocketContext } from '@/providers/socket-provider';
import {
  startPhWaterSimulation,
  stopPhWaterSimulation,
} from '@/api/protected/ph-water-api/ph-water-sensor.api';
import { PhWaterData } from '@/api/protected/ph-water-api/ph-water-sensor.interface';
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
  Droplets,
  Activity,
  Clock,
  WifiOff,
  Play,
  Square,
  Loader2,
  Beaker,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDate } from '@syntaxsentinel/date-utils';

const chartConfig = {
  phLevel: {
    label: 'pH Level',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function PHWaterContent() {
  const { socket } = useContext(SocketContext);
  const [currentPh, setCurrentPh] = useState<PhWaterData | null>(null);
  const [phHistory, setPhHistory] = useState<PhWaterData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState<'normal' | 'acidic' | 'alkaline'>(
    'normal',
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  // Prepare chart data from pH history
  const chartData = useMemo(() => {
    return phHistory
      .slice()
      .reverse()
      .map((reading, index) => {
        return {
          timestamp: formatDate.readableDateTime(reading.timestamp),
          phLevel: Number(reading.phLevel),
          index: index,
        };
      });
  }, [phHistory]);

  useEffect(() => {
    if (!socket) return;

    setIsConnected(socket.connected);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    const handlePhWaterData = (data: PhWaterData) => {
      const phData = {
        ...data,
        timestamp: new Date(data.timestamp),
      };

      setCurrentPh(phData);
      setPhHistory((prev) => [phData, ...prev].slice(0, 20));

      setIsSimulationRunning(true);

      // Determine status based on pH level
      if (phData.phLevel < 6.5) {
        setStatus('acidic');
      } else if (phData.phLevel > 8.5) {
        setStatus('alkaline');
      } else {
        setStatus('normal');
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('sensor:phWater', handlePhWaterData);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('sensor:phWater', handlePhWaterData);
    };
  }, [socket]);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await startPhWaterSimulation();
      setIsSimulationRunning(true);
      showToastSuccess(
        'Monitoring Started',
        res.message || 'pH water monitoring started successfully',
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
        res.message || 'pH water monitoring stopped',
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
      case 'acidic':
        return 'text-orange-500';
      case 'alkaline':
        return 'text-purple-500';
      case 'normal':
        return 'text-primary';
    }
  };

  const getStatusBadgeVariant = () => {
    switch (status) {
      case 'acidic':
        return 'secondary';
      case 'alkaline':
        return 'destructive';
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
            pH Water Monitoring
          </h1>
          <p className="text-muted-foreground">
            Real-time fishpond water pH level tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
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

      {/* Main pH Display */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="w-5 h-5" />
            Current pH Level
          </CardTitle>
          <CardDescription>Fishpond water pH sensor</CardDescription>
        </CardHeader>
        <CardContent>
          {currentPh ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className={`text-6xl max-sm:text-2xl font-bold ${getStatusColor()}`}
                  >
                    {currentPh.phLevel} pH
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatDate.timeOnly(currentPh.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={getStatusBadgeVariant()} className="mb-2">
                    {status.toUpperCase()}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {currentPh.sensorId}
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">
                    Acidic
                  </div>
                  <div className="text-lg font-semibold text-orange-500">
                    &lt; 6.5
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">
                    Optimal Range
                  </div>
                  <div className="text-lg font-semibold text-primary">
                    6.5 - 8.5
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">
                    Alkaline
                  </div>
                  <div className="text-lg font-semibold text-purple-500">
                    &gt; 8.5
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Droplets className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Waiting for pH data...</p>
              <p className="text-sm mt-2">
                Click &quot;Start Monitoring&quot; to begin monitoring
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* pH Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            pH Level Trend
          </CardTitle>
          <CardDescription>
            Real-time pH level visualization (last 20 readings)
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
                margin={{
                  left: 12,
                  right: 12,
                }}
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
                      className="w-[180px]"
                      formatter={(value, name, props) => {
                        const ph = Number(value);
                        return [`${ph.toFixed(2)} pH`, 'pH Level'];
                      }}
                    />
                  }
                />
                <Line
                  dataKey="phLevel"
                  type="monotone"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{
                    fill: '#10b981',
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                    fill: '#059669',
                  }}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No data available for chart</p>
              <p className="text-sm mt-2">
                Start monitoring to see pH level trends
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* pH History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Readings
          </CardTitle>
          <CardDescription>Last 20 pH measurements</CardDescription>
        </CardHeader>
        <CardContent>
          {phHistory.length > 0 ? (
            <div
              className="overflow-y-auto"
              style={{ maxHeight: '30vh', minHeight: '200px' }}
            >
              <div className="space-y-2">
                {phHistory.map((reading, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Beaker className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold max-sm:text-sm">
                        {reading.phLevel} pH
                      </span>
                      <Badge
                        variant={
                          reading.phLevel < 6.5
                            ? 'secondary'
                            : reading.phLevel > 8.5
                            ? 'destructive'
                            : 'default'
                        }
                        className="text-xs"
                      >
                        {reading.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="max-sm:text-[0.7em]">
                        {formatDate.readableDateTime(reading.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No pH history available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average pH</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {phHistory.length > 0
                ? (
                    phHistory.reduce((sum, r) => sum + r.phLevel, 0) /
                    phHistory.length
                  ).toFixed(2)
                : '0.00'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Highest pH</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {phHistory.length > 0
                ? Math.max(...phHistory.map((r) => r.phLevel)).toFixed(2)
                : '0.00'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Lowest pH</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {phHistory.length > 0
                ? Math.min(...phHistory.map((r) => r.phLevel)).toFixed(2)
                : '0.00'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
