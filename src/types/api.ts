export type ApiFieldError = {
  field?: string
  message: string
}

export type ApiResponse<T> = {
  success: true
  message: string
  data: T
}

export type ApiErrorBody = {
  success: false
  message: string
  errors: ApiFieldError[]
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type Paginated<T> = {
  items: T[]
  meta: PaginationMeta
}
