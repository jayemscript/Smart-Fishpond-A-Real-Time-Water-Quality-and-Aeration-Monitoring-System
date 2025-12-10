'use client';

import React, { useContext, useEffect, useState, useMemo } from 'react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { SocketContext } from '@/providers/socket-provider';
import {
  startTurbiditySimulation,
  stopTurbiditySimulation,
} from '@/api/protected/turbidity-api/turbidity-sensor.api';
import { TurbidityData } from '@/api/protected/turbidity-api/turbidity-sensor.interface';
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
  Eye,
  Clock,
  WifiOff,
  Play,
  Square,
  Loader2,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDate } from '@syntaxsentinel/date-utils';

const chartConfig = {
  turbidity: {
    label: 'Turbidity',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function TurbidityContent() {
  const { socket } = useContext(SocketContext);
  const [currentTurbidity, setCurrentTurbidity] =
    useState<TurbidityData | null>(null);
  const [turbidityHistory, setTurbidityHistory] = useState<TurbidityData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState<'clear' | 'moderate' | 'murky'>('clear');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  // Prepare chart data from turbidity history
  const chartData = useMemo(() => {
    return turbidityHistory
      .slice()
      .reverse()
      .map((reading, index) => {
        return {
          timestamp: formatDate.readableDateTime(reading.timestamp),
          turbidity: Number(reading.turbidity),
          index: index,
        };
      });
  }, [turbidityHistory]);

  useEffect(() => {
    if (!socket) return;

    setIsConnected(socket.connected);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    const handleTurbidityData = (data: TurbidityData) => {
      const turbidityData = {
        ...data,
        timestamp: new Date(data.timestamp),
      };

      setCurrentTurbidity(turbidityData);
      setTurbidityHistory((prev) => [turbidityData, ...prev].slice(0, 20));

      setIsSimulationRunning(true);

      // Determine status based on turbidity (0-50 NTU optimal range)
      if (turbidityData.turbidity < 10) {
        setStatus('clear');
      } else if (turbidityData.turbidity > 40) {
        setStatus('murky');
      } else {
        setStatus('moderate');
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('sensor:turbidity', handleTurbidityData);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('sensor:turbidity', handleTurbidityData);
    };
  }, [socket]);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await startTurbiditySimulation();
      setIsSimulationRunning(true);
      showToastSuccess(
        'Monitoring Started',
        res.message || 'Turbidity monitoring started successfully',
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
      const res = await stopTurbiditySimulation();
      setIsSimulationRunning(false);
      showToastSuccess(
        'Monitoring Stopped',
        res.message || 'Turbidity monitoring stopped',
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
      case 'clear':
        return 'text-green-500';
      case 'murky':
        return 'text-destructive';
      case 'moderate':
        return 'text-yellow-500';
    }
  };

  const getStatusBadgeVariant = () => {
    switch (status) {
      case 'clear':
        return 'default';
      case 'murky':
        return 'destructive';
      case 'moderate':
        return 'secondary';
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
            Turbidity Monitoring
          </h1>
          <p className="text-muted-foreground">
            Real-time water clarity tracking
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

      {/* Main Turbidity Display */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Current Turbidity
          </CardTitle>
          <CardDescription>Fishpond water clarity sensor</CardDescription>
        </CardHeader>
        <CardContent>
          {currentTurbidity ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className={`text-6xl max-sm:text-2xl font-bold ${getStatusColor()}`}
                  >
                    {currentTurbidity.turbidity} {currentTurbidity.unit}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatDate.timeOnly(currentTurbidity.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={getStatusBadgeVariant()} className="mb-2">
                    {status.toUpperCase()}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {currentTurbidity.sensorId}
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">
                    Clear Water
                  </div>
                  <div className="text-lg font-semibold text-green-500">
                    &lt;10 NTU
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">
                    Optimal Range
                  </div>
                  <div className="text-lg font-semibold text-yellow-500">
                    10-40 NTU
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">
                    Murky Water
                  </div>
                  <div className="text-lg font-semibold text-destructive">
                    &gt;40 NTU
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Droplets className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Waiting for turbidity data...</p>
              <p className="text-sm mt-2">
                Click &quot;Start Monitoring&quot; to begin monitoring
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Turbidity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Turbidity Trend
          </CardTitle>
          <CardDescription>
            Real-time turbidity visualization (last 20 readings)
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
                        const turb = Number(value);
                        return [`${turb.toFixed(2)} NTU`, 'Turbidity'];
                      }}
                    />
                  }
                />
                <Line
                  dataKey="turbidity"
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
                Start monitoring to see turbidity trends
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Turbidity History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Readings
          </CardTitle>
          <CardDescription>Last 20 turbidity measurements</CardDescription>
        </CardHeader>
        <CardContent>
          {turbidityHistory.length > 0 ? (
            <div
              className="overflow-y-auto"
              style={{ maxHeight: '30vh', minHeight: '200px' }}
            >
              <div className="space-y-2">
                {turbidityHistory.map((reading, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold max-sm:text-sm">
                        {reading.turbidity} {reading.unit}
                      </span>
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
              <p>No turbidity history available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Average Turbidity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {turbidityHistory.length > 0
                ? (
                    turbidityHistory.reduce((sum, r) => sum + r.turbidity, 0) /
                    turbidityHistory.length
                  ).toFixed(2)
                : '0.00'}{' '}
              NTU
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Highest Turbidity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {turbidityHistory.length > 0
                ? Math.max(...turbidityHistory.map((r) => r.turbidity)).toFixed(
                    2,
                  )
                : '0.00'}{' '}
              NTU
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Lowest Turbidity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {turbidityHistory.length > 0
                ? Math.min(...turbidityHistory.map((r) => r.turbidity)).toFixed(
                    2,
                  )
                : '0.00'}{' '}
              NTU
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
