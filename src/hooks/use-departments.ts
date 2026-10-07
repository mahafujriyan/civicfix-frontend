"use client"

import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  listDepartments,
  updateDepartment,
  type DepartmentListQuery,
  type DepartmentUpdateRequest,
  type DepartmentWriteRequest,
} from "@/lib/api/departments"
import { queryKeys } from "@/lib/api/query-keys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useDepartments(query: DepartmentListQuery = {}) {
  return useQuery({
    queryKey: queryKeys.departments(query),
    queryFn: () => listDepartments(query),
  })
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: queryKeys.department(id),
    queryFn: () => getDepartment(id),
    enabled: id.length > 0,
  })
}

export function useCreateDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: DepartmentWriteRequest) => createDepartment(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["departments"] })
    },
  })
}

export function useUpdateDepartment(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: DepartmentUpdateRequest) => updateDepartment(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["departments"] })
    },
  })
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteDepartment(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["departments"] })
    },
  })
}
