import { ScopeSlug } from '../../context/auth/__shared/type'

export type LoginPayload = {
  username: string
  password: string
}

export type LoginResponse = {
  accessToken: string
}

export type User = {
  name: string
  username: string
  email: string
  scope: ScopeSlug
}
