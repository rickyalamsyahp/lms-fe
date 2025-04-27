export type LoginPayload = {
  email: string
  password: string
}

export type User = {
  id?: string
  name: string
  username: string
  email: string
  avatar?: string
  role?: ScopeSlug
  isActive?: boolean
  password?: string
  createdBy?: string
  createdAt?: Date
  modifiedBy?: string
  modifiedAt?: Date
}

export type Teacher = {
  id?: string
  name: string
  userId: string
  classroomId: string
  address: string
  gender: string
  nip: string
  createdBy?: string
  createdAt?: Date
  modifiedBy?: string
  modifiedAt?: Date
}

export type Student = {
  id?: string
  name: string
  userId: string
  classroomId: string
  address: string
  gender: string
  nis: string
  createdBy?: string
  createdAt?: Date
  modifiedBy?: string
  modifiedAt?: Date
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum ScopeSlug {
  ADMIN = 'admin',
  TEACHER = 'guru',
  STUDENT = 'siswa',
}
