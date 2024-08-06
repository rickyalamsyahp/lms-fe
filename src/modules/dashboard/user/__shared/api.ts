import { User } from './type'
import qs from 'query-string'
import { SWRConfiguration } from 'swr'
import { useSWRFetcher } from '../../../../context/use-swr-fetcher'
import { API_URL } from '../../../../libs/env'
import { api, generateFormData } from '../../../../libs/http'
import { ScopeSlug } from '../../../../context/auth/__shared/type'

type GetUserListResponse = {
  results: User[]
  total: string
}

type GetUserListQuery = {
  page: number
  size: number
} & any

export type ChangePasswordBody = {
  oldPassword: string
  newPassword: string
  newPasswordConfirmation: string
}

export function getUserList(scope: ScopeSlug, query: GetUserListQuery) {
  return api.get<GetUserListResponse>(
    `/admin/user-account/scope/${scope}?${qs.stringify(query)}`
  )
}
export function getUserListInstruktur(query: GetUserListQuery) {
  return api.get<GetUserListResponse>(
    `/instructor/user-account?${qs.stringify(query)}`
  )
}

export function getUserById(role: string, id: string) {
  return api.get<User>(`/${role}/user-account/${id}`)
}

export function createUser(payload: User) {
  return api.post<User>('/admin/user-account', payload)
}

export function updateUser(id: string, payload: Partial<User>) {
  return api.put<User>(`/admin/user-account/${id}`, payload)
}

export function changeStatus(id: string) {
  return api.put<User>(`/admin/user-account/${id}/activate`)
}

export async function changePassword(
  body: ChangePasswordBody,
  userId?: string
) {
  return await api.put(
    userId
      ? `/admin/user-account/${userId}/change-password`
      : `/my-profile/change-password`,
    body
  )
}

export function deleteUser(id: string) {
  return api.delete(`/admin/user-account/${id}`)
}

export function changeAvatar(id: string, file: File) {
  const formData = generateFormData([{ key: 'file', file }])
  return api.put(`/admin/user-account/${id}/avatar`, formData)
}

export function getUserAvatarUrl(id: string) {
  return `${API_URL}/open/user-account/${id}/avatar`
}

export function useUserList(
  role: string,
  scope: ScopeSlug,
  query: GetUserListQuery,
  config?: Partial<SWRConfiguration>
) {
  return useSWRFetcher(
    [role, scope, query, 'get-User-list'],
    ([role, scope, query]) =>
      role === 'instructor'
        ? getUserListInstruktur(query)
        : getUserList(scope, query),
    config
  )
}

export function useUser(
  role: string,
  id: string,
  config?: Partial<SWRConfiguration>
) {
  return useSWRFetcher(
    [role, id, 'get-user-by-id'],
    ([role, id]) => getUserById(role, id),
    config
  )
}
