'use client';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { SocketContext } from '@/providers/socket-provider';
import {
  startWaterLevel,
  stopWaterLevel,
} from '@/api/protected/water-level-api/water-level-sensor.api';
import { WaterLevelData } from '@/api/protected/water-level-api/water-level-sensor.interface';
import { showToastError, showToastSuccess } from '@/utils/toast-config';
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
  Activity,
  Droplets,
  Clock,
  WifiOff,
  Play,
  Square,
  Loader2,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDate } from '@syntaxsentinel/date-utils';
import { useRouter } from 'next/navigation';

const chartConfig = {
  waterLevel: {
    label: 'Water Level',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

function getWaterStatus(level: number): 'low' | 'stable' {
  return level === 1 ? 'stable' : 'low';
}

export default function WaterLevelContent() {
  const router = useRouter();
  const { socket } = useContext(SocketContext);

  const [currentLevel, setCurrentLevel] = useState<WaterLevelData | null>(null);
  const [history, setHistory] = useState<WaterLevelData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState<'low' | 'stable'>('stable');
  const [loading, setLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const chartData = useMemo(() => {
    return history
      .slice()
      .reverse()
      .map((reading, index) => ({
        timestamp: formatDate.readableDateTime(reading.timestamp),
        waterLevel: reading.level,
        index,
      }));
  }, [history]);

  useEffect(() => {
    if (!socket) return;

    setIsConnected(socket.connected);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    const handleWaterData = (data: WaterLevelData) => {
      const parsed = {
        ...data,
        timestamp: new Date(data.timestamp),
      };

      setCurrentLevel(parsed);
      setHistory((prev) => [parsed, ...prev].slice(0, 20));
      setStatus(getWaterStatus(parsed.level));
      setIsRunning(true);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('sensor:water-level', handleWaterData);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('sensor:water-level', handleWaterData);
    };
  }, [socket]);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await startWaterLevel();
      setIsRunning(true);
      showToastSuccess('Monitoring Started', res.message, 'bottom-right');
    } catch (err) {
      showToastError(
        'Operation Failed',
        extractErrorMessage(err),
        'bottom-right',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      const res = await stopWaterLevel();
      setIsRunning(false);
      showToastSuccess('Monitoring Stopped', res.message, 'bottom-right');
    } catch (err) {
      showToastError(
        'Operation Failed',
        extractErrorMessage(err),
        'bottom-right',
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (): 'default' | 'destructive' => {
    return status === 'low' ? 'destructive' : 'default';
  };

  if (!socket || !isConnected) {
    return (
      <div className="container mx-auto p-6">
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
      <div className="flex justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Water Level Monitoring
          </h1>
          <p className="text-muted-foreground">
            Real-time float switch monitoring
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => router.push('/water-level-monitoring/logs')}>
            View Logs
          </Button>
          <Badge variant={isConnected ? 'default' : 'destructive'}>
            <Activity className="w-3 h-3 mr-1" />
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>

          {isRunning ? (
            <Button
              onClick={handleStop}
              variant="destructive"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Square className="w-4 h-4 mr-2" />
              )}
              Stop Monitoring
            </Button>
          ) : (
            <Button onClick={handleStart} disabled={loading}>
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

      {/* Current Level */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5" />
            Current Water Level
          </CardTitle>
          <CardDescription>Float switch sensor</CardDescription>
        </CardHeader>
        <CardContent>
          {currentLevel ? (
            <div className="flex justify-between items-center">
              <div>
                <div className="text-5xl font-bold">{status.toUpperCase()}</div>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {formatDate.timeOnly(currentLevel.timestamp)}
                </div>
              </div>

              <div className="text-right">
                <Badge variant={getStatusBadgeVariant()} className="mb-2">
                  {status.toUpperCase()}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {currentLevel.sensorId}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Waiting for water level data...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Water Level Trend</CardTitle>
          <CardDescription>Last 20 readings</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[150px] w-full">
              <LineChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="timestamp" tickLine={false} axisLine={false} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => [
                        value === 1 ? 'Stable' : 'Low',
                        'Water Level',
                      ]}
                    />
                  }
                />
                <Line
                  dataKey="waterLevel"
                  type="stepAfter"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Water Level History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Readings
          </CardTitle>
          <CardDescription>Last 20 water level measurements</CardDescription>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div
              className="overflow-y-auto"
              style={{ maxHeight: '30vh', minHeight: '200px' }}
            >
              <div className="space-y-2">
                {history.map((reading, index) => {
                  const s = reading.level === 1 ? 'stable' : 'low';

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Droplets className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{s.toUpperCase()}</span>
                        <Badge
                          variant={s === 'low' ? 'destructive' : 'default'}
                          className="text-xs"
                        >
                          {s.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate.readableDateTime(reading.timestamp)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No water level history available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
