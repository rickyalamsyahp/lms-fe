import { Category } from './type'
import qs from 'query-string'
import { SWRConfiguration } from 'swr'
import { useSWRFetcher } from '../../../../context/use-swr-fetcher'

import { api, options } from '../../../../libs/http'

type GetCategoryListResponse = {
  results: Category[]
  total: string
}

type GetLessonListQuery = {
  page: number
  size: number
} & any

export function getCategoryList(query: GetLessonListQuery) {
  return api.get<GetCategoryListResponse>(
    `/${options.publicScope}/category?${qs.stringify(query)}`
  )
}

export function getCategoryById(id: string) {
  return api.get<Category>(`/${options.publicScope}/category/${id}`)
}


export function createCategory(payload: any) {
  return api.post<Category>(`/${options.publicScope}/category`, payload)
}

export function updateCategory(id: string, payload: any) {
  return api.put<Category>(`/${options.publicScope}/category/${id}`, payload)
}

export function deleteCategory(id: string) {
  return api.delete(`/${options.publicScope}/category/${id}`)
}


export function useCategoryList(
  query: GetLessonListQuery,
  config?: Partial<SWRConfiguration>
) {
  return useSWRFetcher(
    [query, 'get-category-list'],
    ([query]) => getCategoryList(query),
    config
  )
}

export function useCategory(id: string, config?: Partial<SWRConfiguration>) {
  return useSWRFetcher(
    [id, 'get-category-by-id'],
    ([id]) => getCategoryById(id),
    config
  )
}
