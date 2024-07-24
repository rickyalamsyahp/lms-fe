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

type ChangePasswordBody = {
  oldPassword: string
  newPassword: string
  newPasswordConfirmation: string
}

export function getUserList(scope: ScopeSlug, query: GetUserListQuery) {
  return api.get<GetUserListResponse>(
    `/admin/user-account/scope/${scope}?${qs.stringify(query)}`
  )
}

export function getUserById(id: string) {
  return api.get<User>(`/admin/user-account/${id}`)
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

export async function changePassword(body: ChangePasswordBody) {
  return await api.put(`/my-profile/change-password`, body)
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

export function useProfileList(
  scope: ScopeSlug,
  query: GetUserListQuery,
  config?: Partial<SWRConfiguration>
) {
  return useSWRFetcher(
    [scope, query, 'get-User-list'],
    ([scope, query]) => getUserList(scope, query),
    config
  )
}

export function useProfile(id: string, config?: Partial<SWRConfiguration>) {
  return useSWRFetcher(
    [id, 'get-user-by-id'],
    ([id]) => getUserById(id),
    config
  )
}
