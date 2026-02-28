'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@syntaxsentinel/date-utils';
import { extractErrorMessage } from '@/configs/api.helper';
import { showToastError, showToastSuccess } from '@/utils/toast-config';
import { GetAllPaginatedWaterLevel } from '@/api/protected/sensor-logs/sensor.api';
import { WaterLevelData } from '@/api/protected/sensor-logs/sensor-interface.api';
import { RiWaterFlashFill, RiWaterFlashLine } from 'react-icons/ri';

import {
  Droplets,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  FlaskConical,
  AlertCircle,
  Waves,
  Thermometer,
  ArrowUpCircle,
} from 'lucide-react';

export function useWaterlevelTableLogic() {
  const router = useRouter();
  const [refreshFn, setRefreshFn] = useState<() => void | null>(null);

  const handleSetRefreshFn = useCallback((refresh: () => void) => {
    setRefreshFn(() => refresh);
  }, []);

  const fetchData = async (params: {
    page: number;
    limit: number;
    keyword?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    try {
      const response = await GetAllPaginatedWaterLevel(params);
      if (!response.water_level_data)
        throw new Error('Invalid response structure');
      return {
        data: response.water_level_data,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      };
    } catch (error) {
      showToastError(
        'Fetch failed',
        extractErrorMessage(error),
        'bottom-right',
      );
      console.log(extractErrorMessage(error));
      throw error;
    }
  };

  const columns: ColumnDef<WaterLevelData>[] = [
    {
      accessorKey: 'sensorId',
      size: 100,
      header: () => (
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-blue-500" />
          <span>Description</span>
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2 text-sm">
          <Droplets className="h-4 w-4 text-blue-400" />
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: 'level',
      size: 150,
      header: () => <span>Water Level</span>,
      cell: ({ getValue }) => {
        const level = (getValue() as string | number)?.toString().toLowerCase();

        let icon;
        let message;

        if (level === 'stable' || level === '1') {
          icon = <RiWaterFlashFill className="h-6 w-6 text-green-500" />;
          message = 'Stable – no action required';
        } else if (level === 'low' || level === '0') {
          icon = <RiWaterFlashLine className="h-6 w-6 text-red-500" />;
          message = 'Low – action required';
        } else {
          icon = <RiWaterFlashLine className="h-6 w-6 text-yellow-500" />;
          message = 'Check water level';
        }

        return (
          <div className="flex items-center gap-2">
            {icon}
            <span>{message}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      size: 120,
      header: () => <span>Status</span>,
      cell: ({ getValue }) => {
        const status = (getValue() as string)?.toLowerCase();

        const color =
          status === 'stable'
            ? 'bg-green-100 text-green-700 border-green-300'
            : 'bg-red-100 text-red-700 border-red-300';

        const label = status === 'stable' ? 'Stable' : 'Low';

        return (
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${color}`}
          >
            {label}
          </div>
        );
      },
    },

    {
      accessorKey: 'timestamp',
      size: 120,
      header: () => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span>Time Stamp</span>
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {formatDate.readableDateTime(getValue() as string)}
        </div>
      ),
      enableSorting: false,
    },
  ];

  const cardComponent = ({ row }: { row: any }) => {
    return <div className="space-y-3"></div>;
  };

  return {
    columns,
    fetchData,
    handleSetRefreshFn,
    cardComponent,
  };
}
