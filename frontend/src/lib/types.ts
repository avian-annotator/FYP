//TODO update to use hooks when they come out
export interface Workspace {
  id: string
  name: string
  owner: string
}

export interface User {
  id: string
  name: string
}

export interface ImageItem {
  key: string
  filename: string
  url: string
}

export interface PaginationResponse {
  content: ImageItem[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}
