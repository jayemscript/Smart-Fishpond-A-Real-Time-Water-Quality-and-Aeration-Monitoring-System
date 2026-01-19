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

const chartConfig = {
  waterLevel: {
    label: 'Water Level',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export default function WaterLevelContent() {
  const { socket } = useContext(SocketContext);

  const [currentLevel, setCurrentLevel] = useState<WaterLevelData | null>(null);
  const [history, setHistory] = useState<WaterLevelData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);

  const chartData = useMemo(() => {
    return history
      .slice()
      .reverse()
      .map((reading, index) => ({
        timestamp: formatDate.readableDateTime(reading.timestamp),
        waterLevel: reading.level === 'Up' ? 1 : 0,
        index,
      }));
  }, [history]);

  useEffect(() => {
    if (!socket) return;

    setIsConnected(socket.connected);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onWaterLevel = (data: WaterLevelData) => {
      const parsed = {
        ...data,
        timestamp: new Date(data.timestamp),
      };

      setCurrentLevel(parsed);
      setHistory((prev) => [parsed, ...prev].slice(0, 20));
      setIsRunning(true);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('sensor:water-level', onWaterLevel);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('sensor:water-level', onWaterLevel);
    };
  }, [socket]);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await startWaterLevel();
      setIsRunning(true);
      showToastSuccess(
        'Monitoring Started',
        res.message || 'Water level monitoring started',
        'bottom-right',
      );
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
      showToastSuccess(
        'Monitoring Stopped',
        res.message || 'Water level monitoring stopped',
        'bottom-right',
      );
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

  const statusVariant =
    currentLevel?.status === 'bad' ? 'destructive' : 'default';

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
            Real-time water level tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
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
          <CardDescription>Water level sensor</CardDescription>
        </CardHeader>
        <CardContent>
          {currentLevel ? (
            <div className="flex justify-between items-center">
              <div>
                <div className="text-5xl font-bold">{currentLevel.level}</div>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {formatDate.timeOnly(currentLevel.timestamp)}
                </div>
              </div>

              <div className="text-right">
                <Badge variant={statusVariant} className="mb-2">
                  {currentLevel.status.toUpperCase()}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {currentLevel.sensorId}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Droplets className="w-12 h-12 mx-auto mb-4 opacity-50" />
              Waiting for water level data…
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chart */}
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
                        value === 1 ? 'Up' : 'Down',
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
    </div>
  );
}
