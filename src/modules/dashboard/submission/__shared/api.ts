import { SubmissionExam } from './type'
import qs from 'query-string'
import { SWRConfiguration } from 'swr'
import { useSWRFetcher } from '../../../../context/use-swr-fetcher'

import { api } from '../../../../libs/http'

type GetUserListResponse = {
  results: SubmissionExam[]
  total: string
}

type GetCourseListQuery = {
  page: number
  size: number
} & any

export function getSubmissionList(role: string, query: GetCourseListQuery) {
  return api.get<GetUserListResponse>(
    `/${role}/submission?${qs.stringify(query)}`
  )
}

export function getSubmissionById(role: string, id: string) {
  return api.get<SubmissionExam>(`/${role}/submission/${id}`)
}

export function createSubmission(payload: any) {
  return api.post<SubmissionExam>('/admin/submission', payload)
}

export function updateSubmission(id: string, payload: any) {
  return api.put<SubmissionExam>(`/admin/submission/${id}`, payload)
}

export function changeStatusExam(id: string) {
  return api.put<SubmissionExam>(`/admin/submission/${id}/activate`)
}

export function deleteExam(id: string) {
  return api.delete(`/admin/submission/${id}`)
}

export function downloadFile(id: string) {
  return api.get<any>(`/admin/submission/${id}/download`, {
    responseType: 'blob',
  })
}

export function useSubmissionList(
  role: string,
  query: GetCourseListQuery,
  config?: Partial<SWRConfiguration>
) {
  return useSWRFetcher(
    [role, query, 'get-Submission-list'],
    ([role, query]) => getSubmissionList(role, query),
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
    ([role, id]) => getSubmissionById(role, id),
    config
  )
}
