import { Course } from './type'
import qs from 'query-string'
import { SWRConfiguration } from 'swr'
import { useSWRFetcher } from '../../../../context/use-swr-fetcher'

import { api } from '../../../../libs/http'

type GetUserListResponse = {
  results: Course[]
  total: string
}

type GetCourseListQuery = {
  page: number
  size: number
} & any

export function getCourseList(role: string, query: GetCourseListQuery) {
  return api.get<GetUserListResponse>(`/${role}/course?${qs.stringify(query)}`)
}

export function getCoursById(id: string) {
  return api.get<Course>(`/admin/course/${id}`)
}

export function createCours(payload: any) {
  return api.post<Course>('/admin/course', payload)
}

export function updateCours(id: string, payload: any) {
  return api.put<Course>(`/admin/course/${id}`, payload)
}

export function changeStatus(id: string) {
  return api.put<Course>(`/admin/course/${id}/publish`)
}

export function deleteUser(id: string) {
  return api.delete(`/admin/course/${id}`)
}

export function downloadFile(id: string) {
  return api.get<any>(`/admin/course/${id}/download`, { responseType: 'blob' })
}

export function useCourseList(
  role: string,
  query: GetCourseListQuery,
  config?: Partial<SWRConfiguration>
) {
  return useSWRFetcher(
    [role, query, 'get-Course-list'],
    ([role, query]) => getCourseList(role, query),
    config
  )
}

export function useCours(id: string, config?: Partial<SWRConfiguration>) {
  return useSWRFetcher(
    [id, 'get-user-by-id'],
    ([id]) => getCoursById(id),
    config
  )
}
