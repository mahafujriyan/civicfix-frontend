"use client"

import type { Priority } from "@/types/domain"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type ComplaintDraft = {
  title: string
  description: string
  priority: Priority
  categoryId: string
  address: string
  city: string
  area: string
  step: number
}

type ComplaintDraftState = ComplaintDraft & {
  setDraft: (patch: Partial<ComplaintDraft>) => void
  reset: () => void
}

const emptyDraft: ComplaintDraft = {
  title: "",
  description: "",
  priority: "MEDIUM",
  categoryId: "",
  address: "",
  city: "",
  area: "",
  step: 0,
}

export const useComplaintDraft = create<ComplaintDraftState>()(
  persist(
    (set) => ({
      ...emptyDraft,
      setDraft: (patch) => set(patch),
      reset: () => set(emptyDraft),
    }),
    {
      name: "civicfix.complaintDraft",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
