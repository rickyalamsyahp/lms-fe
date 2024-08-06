import { CourseExam } from './type'
import qs from 'query-string'
import { SWRConfiguration } from 'swr'
import { useSWRFetcher } from '../../../../context/use-swr-fetcher'

import { api } from '../../../../libs/http'

type GetUserListResponse = {
  results: CourseExam[]
  total: string
}

type GetCourseListQuery = {
  page: number
  size: number
} & any

export function getCourseExamList(role: string, query: GetCourseListQuery) {
  return api.get<GetUserListResponse>(
    `/${role}/course-exam?${qs.stringify(query)}`
  )
}

export function getCourseExamSttingList(
  role: string,
  id: string,
  query: GetCourseListQuery
) {
  return api.get<GetUserListResponse>(
    `/${role}/course-exam/${id}/setting?${qs.stringify(query)}`
  )
}

export function getCoursExamById(role: string, id: string) {
  return api.get<CourseExam>(`/${role}/course-exam/${id}`)
}

export function createCoursExam(payload: any) {
  return api.post<CourseExam>('/admin/course-exam', payload)
}

export function updateCoursExam(id: string, payload: any) {
  return api.put<CourseExam>(`/admin/course-exam/${id}`, payload)
}

export function changeStatusExam(id: string) {
  return api.put<CourseExam>(`/admin/course-exam/${id}/activate`)
}

export function deleteExam(id: string) {
  return api.delete(`/admin/course-exam/${id}`)
}

export function downloadFile(id: string) {
  return api.get<any>(`/admin/course-exam/${id}/download`, {
    responseType: 'blob',
  })
}

export function useCourseExamList(
  role: string,
  query: GetCourseListQuery,
  config?: Partial<SWRConfiguration>
) {
  return useSWRFetcher(
    [role, query, 'get-Course-list'],
    ([role, query]) => getCourseExamList(role, query),
    config
  )
}

export function useCourseExamSettingList(
  role: string,
  id: string,
  query: GetCourseListQuery,
  config?: Partial<SWRConfiguration>
) {
  return useSWRFetcher(
    [role, id, query, 'get-Course-list'],
    ([role, id, query]) => getCourseExamSttingList(role, id, query),
    config
  )
}

export function useCours(
  role: string,
  id: string,
  config?: Partial<SWRConfiguration>
) {
  return useSWRFetcher(
    [role, id, 'get-user-by-id'],
    ([role, id]) => getCoursExamById(role, id),
    config
  )
}
