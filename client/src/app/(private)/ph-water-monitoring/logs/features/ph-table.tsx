'use client';

import { DataTable } from '@/components/customs/data-table/data-table.component';
import { usePhTableLogic } from './ph-logs.table.logic';

export default function PhTable() {
  const { columns, fetchData, handleSetRefreshFn, cardComponent } =
    usePhTableLogic();

  return (
    <div className="container mx-auto py-8 ">
      <DataTable
        columns={columns}
        fetchData={fetchData}
        enableServerSide
        enableSearch
        enableColumnVisibility
        enableRowSelection={false}
        enablePagination
        enableSorting
        enableRefreshButton
        searchPlaceholder="Search..."
        title="PhLevel Logs"
        description="History Logs of Ph Level"
        refreshButtonText="Refresh"
        emptyStateMessage="No records found."
        pageSizeOptions={[5, 10, 25, 50, 100]}
        initialLoadDelay={1000}
        fetchLoadDelay={500}
        className="max-w-full"
        onRefresh={handleSetRefreshFn}
        enableCard={true}
        enableUrlSync={true}
        cardComponent={cardComponent}
        storageKey="ph_data"
      />
    </div>
  );
}
