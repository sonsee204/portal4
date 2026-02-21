'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { Pagination } from '@/components/organisms/Pagination';
import { QueryState } from '@/components/molecules/QueryState';
import { AUDIT_GET_LOGS, AUDIT_GET_STATS } from '@/graphql/queries/audit';
import type {
  AuditLog,
  AuditLogList,
  AuditStats,
  AuditCategory,
  AuditStatus,
} from '@/types';
import { AuditStatsCards } from './_components/AuditStatsCards';
import { AuditFilters } from './_components/AuditFilters';
import { AuditTable } from './_components/AuditTable';
import { AuditDetailDrawer } from './_components/AuditDetailDrawer';
import { AuditExportButton } from './_components/AuditExportButton';
import { AUDIT } from '@/lib/strings';

const PAGE_SIZE = 20;

export default function AuditPage() {
  // Filter state
  const [category, setCategory] = useState<AuditCategory | undefined>();
  const [status, setStatus] = useState<AuditStatus | undefined>();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Detail drawer
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Build filter variables
  const filterVariables = useMemo(() => {
    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search.trim()) filter.search = search.trim();
    return {
      filter: Object.keys(filter).length > 0 ? filter : undefined,
      pagination: { page, limit: PAGE_SIZE },
    };
  }, [category, status, search, page]);

  // Queries
  const {
    data: logsData,
    loading: logsLoading,
    error: logsError,
    refetch: refetchLogs,
  } = useQuery<{ auditLogs: AuditLogList }>(AUDIT_GET_LOGS, {
    variables: filterVariables,
    fetchPolicy: 'cache-and-network',
  });

  const {
    data: statsData,
    loading: statsLoading,
    refetch: refetchStats,
  } = useQuery<{ auditStats: AuditStats }>(AUDIT_GET_STATS, {
    fetchPolicy: 'cache-and-network',
  });

  const logs = logsData?.auditLogs?.logs ?? [];
  const totalItems = logsData?.auditLogs?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const stats = statsData?.auditStats;

  // Build category counts from stats
  const totalByCategory = useMemo(() => {
    if (!stats?.byCategory) return undefined;
    const map: Record<string, number> = {};
    for (const item of stats.byCategory) {
      map[item.category] = item.count;
    }
    return map;
  }, [stats]);

  // Handlers
  const handleCategoryChange = useCallback((val: AuditCategory | undefined) => {
    setCategory(val);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((val: AuditStatus | undefined) => {
    setStatus(val);
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleRefresh = useCallback(() => {
    refetchLogs();
    refetchStats();
  }, [refetchLogs, refetchStats]);

  const handleViewDetail = useCallback((log: AuditLog) => {
    setSelectedLog(log);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedLog(null);
  }, []);

  return (
    <>
      <PageHeader title="Audit Logs" description={AUDIT.PAGE.DESCRIPTION}>
        <div className="flex items-center gap-3">
          <AuditExportButton logs={logs} disabled={logsLoading} />
        </div>
      </PageHeader>

      {/* Stats cards */}
      <div className="mt-6">
        <AuditStatsCards stats={stats} loading={statsLoading} />
      </div>

      {/* Filters */}
      <div className="mt-6">
        <AuditFilters
          category={category}
          status={status}
          search={search}
          onCategoryChange={handleCategoryChange}
          onStatusChange={handleStatusChange}
          onSearchChange={handleSearchChange}
          onRefresh={handleRefresh}
          loading={logsLoading}
          totalByCategory={totalByCategory}
        />
      </div>

      {/* Table */}
      <div className="mt-4">
        <QueryState
          loading={logsLoading}
          error={logsError}
          empty={!logsLoading && logs.length === 0}
          onRetry={handleRefresh}
          emptyMessage={AUDIT.PAGE.EMPTY}
          emptyIcon="document-text-outline"
        >
          <AuditTable
            logs={logs}
            loading={logsLoading}
            onViewDetail={handleViewDetail}
          />
        </QueryState>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          className="mt-4"
        />
      )}

      {/* Detail drawer */}
      <AuditDetailDrawer log={selectedLog} onClose={handleCloseDetail} />
    </>
  );
}
