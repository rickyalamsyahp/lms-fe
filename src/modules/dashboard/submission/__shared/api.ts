import { Submission, SubmissionReport } from './type'
import qs from 'query-string'
import { SWRConfiguration } from 'swr'
import { useSWRFetcher } from '../../../../context/use-swr-fetcher'

import { api } from '../../../../libs/http'

type GetSubmissionListResponse = {
  results: Submission[]
  total: string
}

type GetSubmissionListQuery = {
  page: number
  size: number
} & any

type GetSubmissionReportListResponse = {
  results: SubmissionReport[]
  total: string
}

export function getSubmissionList(role: string, query: GetSubmissionListQuery) {
  return api.get<GetSubmissionListResponse>(
    `/${role}/submission?${qs.stringify(query)}`
  )
}

export function getSubmissionById(role: string, id: string) {
  return api.get<Submission>(`/${role}/submission/${id}`)
}

export function createSubmission(payload: any) {
  return api.post<Submission>('/admin/submission', payload)
}

export function updateSubmission(id: string, payload: any) {
  return api.put<Submission>(`/admin/submission/${id}`, payload)
}

export function changeStatusExam(id: string) {
  return api.put<Submission>(`/admin/submission/${id}/activate`)
}

export function deleteExam(id: string) {
  return api.delete(`/admin/submission/${id}`)
}

export function downloadFile(id: string) {
  return api.get<any>(`/admin/submission/${id}/download`, {
    responseType: 'blob',
  })
}

export function getSubmissionReportList(
  role: string,
  id: string,
  query: GetSubmissionListQuery
) {
  return api.get<GetSubmissionReportListResponse>(
    `/${role}/submission/${id}/report?${qs.stringify(query)}`
  )
}

export function useSubmissionList(
  role: string,
  query: GetSubmissionListQuery,
  config?: Partial<SWRConfiguration>
) {
  return useSWRFetcher(
    [role, query, 'get-Submission-list'],
    ([role, query]) => getSubmissionList(role, query),
    config
  )
}

export function useSubmission(
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

export function useSubmissionReportList(
  role: string,
  id: string | null | undefined,
  query: GetSubmissionListQuery,
  config?: Partial<SWRConfiguration>
) {
  return useSWRFetcher(
    id ? [role, id, query, 'get-Submission-report-list'] : null,
    ([role, id, query]) => getSubmissionReportList(role, id, query),
    config
  )
}
