"use client"

import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  updateCategory,
  type CategoryListQuery,
  type CategoryUpdateRequest,
  type CategoryWriteRequest,
} from "@/lib/api/categories"
import { queryKeys } from "@/lib/api/query-keys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useCategories(query: CategoryListQuery = {}) {
  return useQuery({
    queryKey: queryKeys.categories(query),
    queryFn: () => listCategories(query),
  })
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: queryKeys.category(id),
    queryFn: () => getCategory(id),
    enabled: id.length > 0,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CategoryWriteRequest) => createCategory(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CategoryUpdateRequest) => updateCategory(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}
