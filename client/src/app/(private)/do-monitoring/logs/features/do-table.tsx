'use client';

import { DataTable } from '@/components/customs/data-table/data-table.component';
import { useDoTableLogic } from './do-logs.table.logic';

export default function DoTable() {
  const { columns, fetchData, handleSetRefreshFn, cardComponent } =
    useDoTableLogic();

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
        title="Dissolved Oxygen Logs"
        description="History Logs of Dissolved Oxygen"
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
        storageKey="do_data"
      />
    </div>
  );
}
