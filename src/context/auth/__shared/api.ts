import { LoginPayload, User } from './type'
import { SWRConfiguration } from 'swr'
import { api } from '../../../libs/http'
import { useSWRFetcher } from '../../use-swr-fetcher'

export function login(payload: LoginPayload) {
  return api.post<string>(`/auth/authorize`, payload)
}

export function getMyProfile() {
  return api.get<User>('/my-profile')
}

export function useProfile(config?: Partial<SWRConfiguration>, isReady = true) {
  return useSWRFetcher(
    isReady ? ['get-my-profile'] : null,
    getMyProfile,
    config
  )
}
