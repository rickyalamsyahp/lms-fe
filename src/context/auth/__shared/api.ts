import { LoginPayload, User } from './type'
import { SWRConfiguration } from 'swr'
import { api } from '../../../libs/http'
import { useSWRFetcher } from '../../use-swr-fetcher'

export function login(payload: LoginPayload) {
  return api.post<string>(`/auth/authenticate`, payload)
}

export function getMyProfile() {
  return api.get<User>('/my-profile')
}

export function useUser(config?: Partial<SWRConfiguration>) {
  return useSWRFetcher(['get-my-profile'], getMyProfile, config)
}
