"use client"

import {
  assignComplaint,
  type AssignComplaintRequest,
} from "@/lib/api/assignments"
import {
  createComment,
  createComplaint,
  deleteComplaint,
  getComplaint,
  getComplaintHistory,
  listComments,
  listComplaints,
  updateComplaint,
  updateComplaintStatus,
  type ComplaintListQuery,
  type CreateCommentRequest,
  type CreateComplaintRequest,
  type UpdateComplaintRequest,
  type UpdateComplaintStatusRequest,
} from "@/lib/api/complaints"
import { queryKeys } from "@/lib/api/query-keys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useComplaints(query: ComplaintListQuery = {}) {
  return useQuery({
    queryKey: queryKeys.complaints(query),
    queryFn: () => listComplaints(query),
  })
}

export function useComplaint(id: string) {
  return useQuery({
    queryKey: queryKeys.complaint(id),
    queryFn: () => getComplaint(id),
    enabled: id.length > 0,
  })
}

export function useComplaintHistory(id: string) {
  return useQuery({
    queryKey: queryKeys.complaintHistory(id),
    queryFn: () => getComplaintHistory(id),
    enabled: id.length > 0,
  })
}

export function useComplaintComments(id: string) {
  return useQuery({
    queryKey: queryKeys.complaintComments(id),
    queryFn: () => listComments(id),
    enabled: id.length > 0,
  })
}

export function useCreateComplaint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateComplaintRequest) => createComplaint(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["complaints"] })
    },
  })
}

export function useUpdateComplaint(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateComplaintRequest) => updateComplaint(id, input),
    onSuccess: (complaint) => {
      queryClient.setQueryData(queryKeys.complaint(id), complaint)
      void queryClient.invalidateQueries({ queryKey: ["complaints"] })
    },
  })
}

export function useDeleteComplaint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteComplaint(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["complaints"] })
    },
  })
}

export function useUpdateComplaintStatus(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateComplaintStatusRequest) =>
      updateComplaintStatus(id, input),
    onSuccess: (complaint) => {
      queryClient.setQueryData(queryKeys.complaint(id), complaint)
      void queryClient.invalidateQueries({
        queryKey: queryKeys.complaintHistory(id),
      })
      void queryClient.invalidateQueries({ queryKey: ["complaints"] })
    },
  })
}

export function useAssignComplaint(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: AssignComplaintRequest) => assignComplaint(id, input),
    onSuccess: (complaint) => {
      queryClient.setQueryData(queryKeys.complaint(id), complaint)
      void queryClient.invalidateQueries({
        queryKey: queryKeys.complaintHistory(id),
      })
      void queryClient.invalidateQueries({ queryKey: ["complaints"] })
    },
  })
}

export function useCreateComment(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateCommentRequest) => createComment(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.complaintComments(id),
      })
    },
  })
}
