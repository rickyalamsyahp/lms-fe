import { Lesson } from './type'
import qs from 'query-string'
import { SWRConfiguration } from 'swr'
import { useSWRFetcher } from '../../../../context/use-swr-fetcher'

import { api, options } from '../../../../libs/http'

type GetUserListResponse = {
  results: Lesson[]
  total: string
}

type GetLessonListQuery = {
  page: number
  size: number
} & any

export function getLessonList(query: GetLessonListQuery) {
  return api.get<GetUserListResponse>(
    `/${options.publicScope}/lesson?${qs.stringify(query)}`
  )
}

export function getLessonById(id: string) {
  return api.get<Lesson>(`/${options.publicScope}/lesson/${id}`)
}

export function createLesson(payload: any) {
  return api.post<Lesson>('/${role}/lesson', payload)
}

export function updateLesson(id: string, payload: any) {
  return api.put<Lesson>(`/admin/lesson/${id}`, payload)
}

export function togglePublish(id: string) {
  return api.put<Lesson>(`/admin/lesson/${id}/publish`)
}

export function deleteLesson(id: string) {
  return api.delete(`/admin/lesson/${id}`)
}

export function downloadFile(id: string) {
  return api.get<any>(`/admin/lesson/${id}/download`, { responseType: 'blob' })
}

export function getLessonStats(id: string, userId?: string) {
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
  }>(`/public/lesson/${id}/stats${userId ? `/${userId}` : ''}`)
}

export function useLessonList(
  query: GetLessonListQuery,
  config?: Partial<SWRConfiguration>
) {
  return useSWRFetcher(
    [query, 'get-Lesson-list'],
    ([query]) => getLessonList(query),
    config
  )
}

export function useLesson(id: string, config?: Partial<SWRConfiguration>) {
  return useSWRFetcher(
    [id, 'get-course-by-id'],
    ([id]) => getLessonById(id),
    config
  )
}

export function useLessonStats(
  id: string,
  userId?: string,
  config?: Partial<SWRConfiguration>
) {
  return useSWRFetcher(
    [id, userId, `get-course-stats${userId ? `-${userId}` : ''}`],
    ([id, userId]) => getLessonStats(id, userId),
    config
  )
}
