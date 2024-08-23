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

export function getCourseExamStats(id: string, userId?: string) {
  return api.get<{
    submission: {
      total: number
      ongoing: number
      finished: number
      canceled: number
    }
    avgScore: number
    latestScore?: number
    hasFinished?: boolean
    progress?: {
      totalExam: number
      totalFinishedExam: number
      percentage: number
    }
  }>(`/public/course-exam/${id}/stats${userId ? `/${userId}` : ''}`)
}

export function useCourseExamList(
  role: string,
  query: GetCourseListQuery,
  config?: Partial<SWRConfiguration>
) {
  return useSWRFetcher(
    [role, query, 'get-course-exam-list'],
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
    [role, id, query, 'get-course-exam-setting-list'],
    ([role, id, query]) => getCourseExamSttingList(role, id, query),
    config
  )
}

export function useCourseExam(
  role: string,
  id: string,
  config?: Partial<SWRConfiguration>
) {
  return useSWRFetcher(
    [role, id, 'get-course-exam-by-id'],
    ([role, id]) => getCoursExamById(role, id),
    config
  )
}

export function useCourseExamStats(
  id: string,
  userId?: string,
  config?: Partial<SWRConfiguration>
) {
  return useSWRFetcher(
    [id, userId, `get-course-exam-stats${userId ? `-${userId}` : ''}`],
    ([id, userId]) => getCourseExamStats(id, userId),
    config
  )
}
