export type UserRole = "CITIZEN" | "STAFF" | "ADMIN"

export type AuthProvider = "LOCAL" | "GOOGLE"

export type ComplaintStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | "REJECTED"
  | "CANCELLED"

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED"

export type SortOrder = "asc" | "desc"

export type NamedRef = {
  id: string
  name: string
}

export type PersonRef = {
  id: string
  fullName: string
  email: string
}

export type User = {
  id: string
  email: string
  fullName: string
  phone: string | null
  role: UserRole
  provider: AuthProvider
  googleId: string | null
  isActive: boolean
  departmentId: string | null
  createdAt: string
  updatedAt: string
  department?: NamedRef | null
}

export type AuthSession = {
  user: User
  accessToken: string
}

export type Department = {
  id: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  categories?: NamedRef[]
  _count?: {
    categories?: number
    users?: number
    complaints?: number
  }
}

export type Category = {
  id: string
  name: string
  description: string | null
  departmentId: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  department?: NamedRef | null
  _count?: {
    complaints?: number
  }
}

export type Location = {
  id: string
  address: string
  city: string
  area: string | null
  latitude: number | null
  longitude: number | null
  createdAt: string
  updatedAt: string
}

export type LocationInput = {
  address: string
  city: string
  area?: string
  latitude?: number
  longitude?: number
}

export type ComplaintAssignment = {
  id: string
  complaintId: string
  staffId: string
  assignedById: string
  notes: string | null
  isActive: boolean
  assignedAt: string
  unassignedAt: string | null
  staff: PersonRef
}

export type Feedback = {
  id: string
  complaintId: string
  citizenId: string
  rating: number
  comment: string | null
  createdAt: string
  updatedAt: string
  citizen?: {
    id: string
    fullName: string
  }
}

export type Complaint = {
  id: string
  title: string
  description: string
  priority: Priority
  status: ComplaintStatus
  categoryId: string
  locationId: string
  createdById: string
  departmentId: string | null
  resolvedAt: string | null
  closedAt: string | null
  createdAt: string
  updatedAt: string
  category: NamedRef
  department: NamedRef | null
  location: Location
  createdBy: PersonRef
  assignments: ComplaintAssignment[]
  feedback: Feedback | null
}

export type ComplaintStatusHistory = {
  id: string
  complaintId: string
  fromStatus: ComplaintStatus | null
  toStatus: ComplaintStatus
  changedById: string
  note: string | null
  createdAt: string
  changedBy: {
    id: string
    fullName: string
    role: UserRole
  }
}

export type Comment = {
  id: string
  complaintId: string
  authorId: string
  content: string
  isInternal: boolean
  createdAt: string
  updatedAt: string
  author: {
    id: string
    fullName: string
    role: UserRole
  }
}

export type Payment = {
  id: string
  complaintId: string | null
  userId: string
  amount: number
  currency: string
  status: PaymentStatus
  stripeSessionId: string | null
  stripePaymentIntentId: string | null
  description: string | null
  paidAt: string | null
  createdAt: string
  updatedAt: string
  complaint?: {
    id: string
    title: string
    status: ComplaintStatus
  } | null
}

export type CheckoutSession = {
  payment: Payment
  checkoutUrl: string | null
  sessionId: string
}

export type Notification = {
  id: string
  userId: string
  complaintId: string | null
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export type AssignableStaff = {
  id: string
  fullName: string
  email: string
  department: NamedRef | null
}

export type AdminOverview = {
  complaints: {
    total: number
    open: number
    resolved: number
    closed: number
  }
  users: {
    total: number
    staff: number
    citizens: number
  }
  payments: {
    paid: number
    pending: number
  }
}

export type ComplaintAnalytics = {
  byStatus: Array<{ status: ComplaintStatus; count: number }>
  byPriority: Array<{ priority: Priority; count: number }>
  byCategory: Array<{
    categoryId: string
    categoryName: string
    count: number
  }>
  recent: Array<{
    id: string
    title: string
    status: ComplaintStatus
    priority: Priority
    createdAt: string
  }>
}
