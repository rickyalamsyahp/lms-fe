/* eslint-disable @typescript-eslint/no-unused-vars */
import { Course } from './type'
import qs from 'query-string'
import { SWRConfiguration } from 'swr'
import { useSWRFetcher } from '../../../../context/use-swr-fetcher'

import { api, options } from '../../../../libs/http'

type GetUserListResponse = {
  results: Course[]
  total: string
}

type GetCourseListQuery = {
  page: number
  size: number
} & any

export function getCourseList(query: GetCourseListQuery) {
  return api.get<any>(`/soal/banksoal?${qs.stringify(query)}`)
}

export function getMapel(query: any) {
  return api.get<any>(`/public/matapelajaran?${qs.stringify(query)}`)
}
export function getMapMapel(query: any) {
  return api.get<any>(`/public/mapmatapelajaran?${qs.stringify(query)}`)
}

export function getKelas(query: any) {
  return api.get<any>(`/guru/kelas?${qs.stringify(query)}`)
}

export function getJurusan(query: any) {
  return api.get<any>(`/guru/jurusan?${qs.stringify(query)}`)
}

export function getCoursById(id: string) {
  return api.get<Course>(`/${options.scope}/course/${id}`)
}

export function createCours(payload: any) {
  return api.post<any>('/soal/banksoal', payload)
}

export function updateCours(id: string, payload: any) {
  return api.put<Course>(`/admin/course/${id}`, payload)
}

export function togglePublish(id: string) {
  return api.put<Course>(`/admin/course/${id}/publish`)
}

export function deleteUser(id: string) {
  return api.delete(`/admin/course/${id}`)
}

export function downloadFile(id: string) {
  return api.get<any>(`/admin/course/${id}/download`, { responseType: 'blob' })
}

export function getCourseStats(id: string, userId?: string) {
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
  }>(`/public/course/${id}/stats${userId ? `/${userId}` : ''}`)
}

export function useCourseList(
  query: GetCourseListQuery,
  config?: Partial<SWRConfiguration>
) {
  return useSWRFetcher(
    [query, 'get-Course-list'],
    ([query]) => getCourseList(query),
    config
  )
}

export function useCourse(id: string, config?: Partial<SWRConfiguration>) {
  return useSWRFetcher(
    [id, 'get-course-by-id'],
    ([id]) => getCoursById(id),
    config
  )
}

export function useCourseStats(
  id: string,
  userId?: string,
  config?: Partial<SWRConfiguration>
) {
  return useSWRFetcher(
    [id, userId, `get-course-stats${userId ? `-${userId}` : ''}`],
    ([id, userId]) => getCourseStats(id, userId),
    config
  )
}
