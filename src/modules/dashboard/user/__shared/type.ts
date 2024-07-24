export type User = {
  id?: string
  name: string
  username: string
  email: string
  avatar?: string
  scope: string
  isActive?: boolean
  password?: string
  createdBy?: string
  createdAt?: Date
  modifiedBy?: string
  modifiedAt?: Date
  bio?: {
    userId?: string
    position?: string
    born?: string
    officialCode?: string
  }
}
