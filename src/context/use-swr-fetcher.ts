import { AxiosResponse } from 'axios'
import useSWR, { SWRConfiguration } from 'swr'

type SWRHookFn<T> = (params: any) => Promise<AxiosResponse<T, any>>

export function useSWRFetcher<T>(
  key: any,
  fetcherFunction: SWRHookFn<T>,
  config?: Partial<SWRConfiguration>
) {
  const { data, ...response } = useSWR(key, fetcherFunction, config)

  return {
    data: data?.data,
    ...response,
  }
}
