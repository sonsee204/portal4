'use client';

import { useQuery } from '@apollo/client/react';
import { GET_USER_PROFILE } from '@/graphql/queries/user';
import type { GetUserProfileResponse } from '@/types';

export function useUserProfile(userId: string | undefined) {
  const { data, loading, error, refetch } = useQuery<GetUserProfileResponse>(
    GET_USER_PROFILE,
    {
      variables: { userId: userId ?? '' },
      skip: !userId,
    },
  );

  return {
    user: data?.getUserProfile,
    loading,
    error,
    refetch,
  };
}
