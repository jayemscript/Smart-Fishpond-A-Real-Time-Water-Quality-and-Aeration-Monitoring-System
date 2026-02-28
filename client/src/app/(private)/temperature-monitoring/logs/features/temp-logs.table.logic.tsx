'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@syntaxsentinel/date-utils';
import { extractErrorMessage } from '@/configs/api.helper';
import { showToastError, showToastSuccess } from '@/utils/toast-config';
import { GetAllPaginatedTemp } from '@/api/protected/sensor-logs/sensor-logs.api';
import { TempData } from '@/api/protected/sensor-logs/sensor-interface.api';

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
} from 'lucide-react';

export function useTempTableLogic() {
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
      const response = await GetAllPaginatedTemp(params);
      if (!response.temp_data) throw new Error('Invalid response structure');
      return {
        data: response.temp_data,
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

  const columns: ColumnDef<TempData>[] = [
    {
      accessorKey: 'sensorId',
      size: 200,
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
      accessorKey: 'temperature',
      size: 150,
      header: () => (
        <div className="flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-red-500" />
          <span>Temperature</span>
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2 text-sm">
          <Thermometer className="h-4 w-4 text-red-400" />
          <span className="font-semibold">{Number(getValue())}</span>
        </div>
      ),
    },

    {
      accessorKey: 'unit',
      size: 120,
      header: () => (
        <div className="flex items-center gap-2">
          <span>Unit</span>
        </div>
      ),
      cell: ({ getValue }) => {
        const rawUnit = (getValue() as string)?.toLowerCase();

        const unitLabel =
          rawUnit === 'celsius' || rawUnit === 'c'
            ? '°C (Celsius)'
            : rawUnit === 'fahrenheit' || rawUnit === 'f'
              ? '°F (Fahrenheit)'
              : rawUnit;

        return (
          <div className="text-sm font-medium text-muted-foreground">
            {unitLabel}
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
