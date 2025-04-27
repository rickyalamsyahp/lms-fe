import { User } from './type'
import { SWRConfiguration } from 'swr'
import { api, generateFormData } from '../../../libs/http'
import { useSWRFetcher } from '../../use-swr-fetcher'

export function login(payload: any) {
  return api.post<string>(`/auth/authorize`, payload)
}

export function getMyProfile() {
  return api.get<any>('/my-profile')
}

export function updateMyProfile(payload: Partial<User>) {
  return api.put<User>(`/my-profile`, payload)
}

export function changeMyAvatar(file: any) {
  const formData = generateFormData([{ key: 'file', file }])
  return api.put(`/my-profile/avatar`, formData)
}

export function deleteMyAvatar() {
  return api.delete(`/my-profile/avatar`)
}

export function useProfile(config?: Partial<SWRConfiguration>, isReady = true) {
  return useSWRFetcher(
    isReady ? ['get-my-profile'] : null,
    getMyProfile,
    config
  )
}
