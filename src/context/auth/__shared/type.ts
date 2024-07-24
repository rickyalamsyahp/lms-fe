export type LoginPayload = {
  username: string
  password: string
}

export type User = {
  name: string
  username: string
  email: string
  scope: ScopeSlug
}

export enum ScopeSlug {
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  TRAINEE = 'trainee',
}
