/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from '../../../auth/type'
import qs from 'query-string'
import { SWRConfiguration } from 'swr'
import { useSWRFetcher } from '../../../../context/use-swr-fetcher'
import { API_URL } from '../../../../libs/env'
import { api, generateFormData, options } from '../../../../libs/http'
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

export function getUserById(id: string) {
  return api.get<User>(`/public/user-account/${id}`)
}

export function createUser(payload: User) {
  return api.post<User>(`/${options.scope}/user-account`, payload)
}

export function updateUser(id: string, payload: Partial<User>) {
  return api.put<User>(`/${options.scope}/user-account/${id}`, payload)
}

export function changeStatus(id: string) {
  return api.put<User>(`/${options.scope}/user-account/${id}/activate`)
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

export async function deleteUser(id: string, state: any) {
  try {
    const linked =
      state.profile?.scope === 'instructor' ? 'instructor' : 'admin'

    // First, delete the submission for the user
    const sub = await api.get(`/${linked}/submission?owner:eq=${id}`)
    // // console.log("TES0");
    if (sub.data.results.length > 0) {
      // console.log("TES1");
      const resSub = await api.delete(`/${linked}/submission/user/${id}`)
      // console.log("TES2");

      // Once the submission is deleted, delete the user account
      if (resSub.status === 200) {
        // Ensure the submission was successfully deleted
        // console.log("TES3");

        const res = await api.delete(`/${linked}/user-account/${id}`)
        // console.log("TES4");

        return res.data
      } else {
        throw new Error(
          'Failed to delete submission. User account deletion aborted.'
        )
      }
    } else {
      // console.log("TES5");
      const res = await api.delete(`/${linked}/user-account/${id}`)
      return res.data
    }
  } catch (error) {
    console.error('Error during deletion process:', error)
    throw error
  }
  // return api.delete(`/admin/submission/user/${id}`)
  // return api.delete(`/admin/user-account/${id}`)
}

export function changeAvatar(id: string, file: any) {
  const formData = generateFormData([{ key: 'file', file }])
  return api.put(`/${options.scope}/user-account/${id}/avatar`, formData)
}
export function deleteAvatar(id: string) {
  return api.delete(`/${options.scope}/user-account/${id}/avatar`)
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

export function useUser(id?: string, config?: Partial<SWRConfiguration>) {
  return useSWRFetcher(
    id ? [id, 'get-user-by-id'] : null,
    ([id]) => getUserById(id),
    config
  )
}
