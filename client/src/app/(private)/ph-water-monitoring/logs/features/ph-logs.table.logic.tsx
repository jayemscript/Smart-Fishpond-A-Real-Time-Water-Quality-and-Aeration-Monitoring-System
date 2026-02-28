'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@syntaxsentinel/date-utils';
import { extractErrorMessage } from '@/configs/api.helper';
import { showToastError, showToastSuccess } from '@/utils/toast-config';
import { GetAllPaginatedPh } from '@/api/protected/sensor-logs/sensor-logs.api';
import { PhData } from '@/api/protected/sensor-logs/sensor-interface.api';

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
} from 'lucide-react';

export function usePhTableLogic() {
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
      const response = await GetAllPaginatedPh(params);
      if (!response.ph_data) throw new Error('Invalid response structure');
      return {
        data: response.ph_data,
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

  const columns: ColumnDef<PhData>[] = [
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
      accessorKey: 'phLevel',
      size: 200,
      header: () => (
        <div className="flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-purple-500" />
          <span>pH Level</span>
        </div>
      ),
      cell: ({ getValue }) => {
        const value = Number(getValue());

        return (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">{value}</span>
            <span className="text-xs text-muted-foreground">pH</span>
          </div>
        );
      },
    },

    {
      accessorKey: 'status',
      size: 200,
      header: () => <span>Status</span>,
      cell: ({ getValue }) => {
        const rawStatus = (getValue() as string)?.toLowerCase();

        const statusMap = {
          normal: {
            icon: <CheckCircle2 className="h-4 w-4" />,
            color: 'bg-green-100 text-green-700 border-green-300',
            label: 'Normal',
          },
          acidic: {
            icon: <AlertCircle className="h-4 w-4" />,
            color: 'bg-red-100 text-red-700 border-red-300',
            label: 'Acidic',
          },
          alkaline: {
            icon: <Waves className="h-4 w-4" />,
            color: 'bg-blue-100 text-blue-700 border-blue-300',
            label: 'Alkaline',
          },
        };

        const config =
          statusMap[rawStatus as keyof typeof statusMap] ?? statusMap.normal;

        return (
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}
          >
            {config.icon}
            {config.label}
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
