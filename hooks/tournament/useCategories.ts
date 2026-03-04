'use client';

import { useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_TOURNAMENT_CATEGORIES } from '@/graphql/queries/tournament';
import { CREATE_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY } from '@/graphql/mutations/tournament';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';
import { TOURNAMENT } from '@/lib/strings';
import type {
  TournamentCategory,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/graphql/generated';

export function useTournamentCategories(tournamentId: string, skip = false) {
  const { data, loading, error, refetch } = useQuery<{
    tournamentCategories: TournamentCategory[];
  }>(GET_TOURNAMENT_CATEGORIES, {
    variables: { tournamentId },
    fetchPolicy: 'cache-and-network',
    skip: skip || !tournamentId,
  });

  return {
    categories: data?.tournamentCategories ?? [],
    loading,
    error,
    refetch,
  };
}

export function useCreateCategory(tournamentId: string, options?: { onSuccess?: () => void }) {
  const [mutation, { loading }] = useMutation<{
    createCategory: TournamentCategory;
  }>(CREATE_CATEGORY, {
    refetchQueries: tournamentId
      ? [{ query: GET_TOURNAMENT_CATEGORIES, variables: { tournamentId } }]
      : [],
    ...createMutationOptions('CreateCategory', TOURNAMENT.SUCCESS_CREATE_CATEGORY),
    onCompleted: () => options?.onSuccess?.(),
  });

  const createCategory = useCallback(
    (input: CreateCategoryInput) => mutation({ variables: { input } }),
    [mutation],
  );

  return { createCategory, loading };
}

export function useUpdateCategory(tournamentId: string, options?: { onSuccess?: () => void }) {
  const [mutation, { loading }] = useMutation<{
    updateCategory: TournamentCategory;
  }>(UPDATE_CATEGORY, {
    refetchQueries: tournamentId
      ? [{ query: GET_TOURNAMENT_CATEGORIES, variables: { tournamentId } }]
      : [],
    ...createMutationOptions('UpdateCategory', TOURNAMENT.SUCCESS_UPDATE_CATEGORY),
    onCompleted: () => options?.onSuccess?.(),
  });

  const updateCategory = useCallback(
    (input: UpdateCategoryInput) => mutation({ variables: { input } }),
    [mutation],
  );

  return { updateCategory, loading };
}

export function useDeleteCategory(tournamentId: string, options?: { onSuccess?: () => void }) {
  const [mutation, { loading }] = useMutation(DELETE_CATEGORY, {
    refetchQueries: tournamentId
      ? [{ query: GET_TOURNAMENT_CATEGORIES, variables: { tournamentId } }]
      : [],
    ...createMutationOptions('DeleteCategory', TOURNAMENT.SUCCESS_DELETE_CATEGORY),
    onCompleted: () => options?.onSuccess?.(),
  });

  const deleteCategory = useCallback(
    (id: string) => mutation({ variables: { id } }),
    [mutation],
  );

  return { deleteCategory, loading };
}
