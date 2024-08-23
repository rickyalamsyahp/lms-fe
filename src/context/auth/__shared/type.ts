export type LoginPayload = {
  username: string
  password: string
}

export type User = {
  id?: string
  name: string
  username: string
  email: string
  avatar?: string
  scope: ScopeSlug
  isActive?: boolean
  password?: string
  createdBy?: string
  createdAt?: Date
  modifiedBy?: string
  modifiedAt?: Date
  bio?: {
    userId?: string
    gender?: Gender & null
    born?: string
    phoneNumber?: string
    identityNumber?: string
  }
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum ScopeSlug {
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  TRAINEE = 'trainee',
}
