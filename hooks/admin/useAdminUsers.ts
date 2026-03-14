'use client';

import { useQuery } from '@apollo/client/react';
import { ADMIN_GET_USERS } from '@/graphql/queries/admin';
import type { AdminGetUsersResponse, UserRole } from '@/types';

interface AdminUsersVariables {
  role?: UserRole;
  isActive?: boolean;
  isSuspended?: boolean;
  searchQuery?: string;
  pagination?: { page: number; limit: number };
}

export function useAdminUsers(variables: AdminUsersVariables) {
  const { data, loading, error, refetch } = useQuery<AdminGetUsersResponse>(
    ADMIN_GET_USERS,
    {
      variables: {
        ...variables,
        searchQuery: variables.searchQuery || undefined,
      },
      fetchPolicy: 'cache-and-network',
    },
  );

  return {
    users: data?.adminGetUsers.users ?? [],
    total: data?.adminGetUsers.total ?? 0,
    loading,
    error,
    refetch,
  };
}
