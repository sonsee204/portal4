'use client';

import { useQuery } from '@apollo/client/react';
import { GET_SPORTS } from '@/graphql/queries/sport';

export interface SportData {
  _id: string;
  type: string;
  name: string;
  nameEn?: string;
  icon: string;
  emoji?: string;
  colorKey?: string;
  isPopular: boolean;
  isActive: boolean;
  displayOrder?: number;
}

export function useSports() {
  const { data, loading, error, refetch } = useQuery<{ sports: SportData[] }>(GET_SPORTS);

  return {
    sports: data?.sports ?? [],
    loading,
    error,
    refetch,
  };
}
