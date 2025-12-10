'use client';

import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '@/providers/socket-provider';
import {
  startTemperatureSimulation,
  stopTemperatureSimulation,
} from '@/api/protected/temperature-api/temperature-sensor.api';
import { TemperatureData } from '@/api/protected/temperature-api/temperature-sensor.interface';
import { showToastSuccess, showToastError } from '@/utils/toast-config';
import { extractErrorMessage } from '@/configs/api.helper';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Thermometer,
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

export default function TemperatureContent() {
  const { socket } = useContext(SocketContext);
  const [currentTemp, setCurrentTemp] = useState<TemperatureData | null>(null);
  const [tempHistory, setTempHistory] = useState<TemperatureData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState<'optimal' | 'low' | 'high'>('optimal');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  useEffect(() => {
    if (!socket) return;

    setIsConnected(socket.connected);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    const handleTemperatureData = (data: TemperatureData) => {
      const tempData = {
        ...data,
        timestamp: new Date(data.timestamp),
      };

      setCurrentTemp(tempData);
      setTempHistory((prev) => [tempData, ...prev].slice(0, 20));

      setIsSimulationRunning(true);

      // Determine status based on temperature
      if (tempData.temperature < 25) {
        setStatus('low');
      } else if (tempData.temperature > 32) {
        setStatus('high');
      } else {
        setStatus('optimal');
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('sensor:temperature', handleTemperatureData);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('sensor:temperature', handleTemperatureData);
    };
  }, [socket]);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await startTemperatureSimulation();
      setIsSimulationRunning(true);
      showToastSuccess(
        'Simulation Started',
        res.message || 'Temperature monitoring started successfully',
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
      const res = await stopTemperatureSimulation();
      setIsSimulationRunning(false);
      showToastSuccess(
        'Simulation Stopped',
        res.message || 'Temperature monitoring stopped',
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
        return 'text-blue-500';
      case 'high':
        return 'text-destructive';
      case 'optimal':
        return 'text-primary';
    }
  };

  const getStatusBadgeVariant = () => {
    switch (status) {
      case 'low':
        return 'secondary';
      case 'high':
        return 'destructive';
      case 'optimal':
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
            Temperature Monitoring
          </h1>
          <p className="text-muted-foreground">
            Real-time water temperature tracking
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

      {/* Main Temperature Display */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5" />
            Current Temperature
          </CardTitle>
          <CardDescription>Fishpond water temperature sensor</CardDescription>
        </CardHeader>
        <CardContent>
          {currentTemp ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-6xl font-bold ${getStatusColor()}`}>
                    {currentTemp.temperature}°C
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatDate.timeOnly(currentTemp.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={getStatusBadgeVariant()} className="mb-2">
                    {status.toUpperCase()}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {currentTemp.sensorId}
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">
                    Low Threshold
                  </div>
                  <div className="text-lg font-semibold text-blue-500">
                    25°C
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">
                    Optimal Range
                  </div>
                  <div className="text-lg font-semibold text-primary">
                    25-32°C
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">
                    High Threshold
                  </div>
                  <div className="text-lg font-semibold text-destructive">
                    32°C
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Droplets className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Waiting for temperature data...</p>
              <p className="text-sm mt-2">
                Click &quot;Start Simulation&quot; to begin monitoring
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Temperature History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Readings
          </CardTitle>
          <CardDescription>Last 20 temperature measurements</CardDescription>
        </CardHeader>
        <CardContent>
          {tempHistory.length > 0 ? (
            <div
              className="overflow-y-auto"
              style={{ maxHeight: '30vh', minHeight: '200px' }}
            >
              <div className="space-y-2">
                {tempHistory.map((reading, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Thermometer className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">
                        {reading.temperature}°C
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span>
                        {formatDate.readableDateTime(reading.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No temperature history available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average Temp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tempHistory.length > 0
                ? (
                    tempHistory.reduce((sum, r) => sum + r.temperature, 0) /
                    tempHistory.length
                  ).toFixed(2)
                : '0.00'}
              °C
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Highest Temp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tempHistory.length > 0
                ? Math.max(...tempHistory.map((r) => r.temperature)).toFixed(2)
                : '0.00'}
              °C
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Lowest Temp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tempHistory.length > 0
                ? Math.min(...tempHistory.map((r) => r.temperature)).toFixed(2)
                : '0.00'}
              °C
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
