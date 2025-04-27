import axios from 'axios'
import cookie from 'cookie-cutter'
import { API_URL } from './env'
import { ScopeSlug } from '../context/auth/__shared/type'

class Options {
  headers: any
  scope: ScopeSlug
  publicScope: string
  constructor() {
    this.headers = {}
    this.scope = ScopeSlug.STUDENT
    this.publicScope = this.scope === ScopeSlug.STUDENT ? 'public' : this.scope
  }

  setHeaders(key: string, value: string) {
    this.headers[key as keyof typeof this] = value
  }

  deleteHeaders(key: string) {
    delete this.headers[key]
  }

  setScope(newScope: ScopeSlug) {
    this.scope = newScope
    this.publicScope = this.scope === ScopeSlug.STUDENT ? 'public' : this.scope
  }
}

export const options = new Options()

export const cookieNames = {
  USER_ACCESS_TOKEN: 'user_access_token',
}

export let urlPrefix = ''

export const setAccessToken = (name: string, accessToken: string) => {
  cookie.set(name, accessToken, { path: '/' })
}

export const getAcceessToken = (name: string) => {
  return cookie.get(name)
}

export const deleteAccessToken = (name: string) => {
  cookie.set(name, '', { expires: new Date(0) })
}

export const setUrlPrefix = (value: any) => {
  urlPrefix = value
}

export const generateFormData = (
  files: {
    key: string
    file: File
  }[],
  payload: any = {}
) => {
  const formData = new FormData()
  files.forEach((each) => {
    formData.append(each.key, each.file)
  })
  for (const key in payload) {
    formData.append(key, payload[key as keyof typeof payload])
  }

  return formData
}

const Request = (baseURL: string, cookieName?: string) => {
  const instance = axios.create({ baseURL })
  instance.interceptors.request.use(
    async (request) => {
      if (cookieName) {
        const accessToken = getAcceessToken(cookieName)
        if (accessToken) request.headers.Authorization = `Bearer ${accessToken}`
      }
      return request
    },
    (error) => {
      console.log('API Error:', error)
      throw error
    }
  )

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const { response } = error
      if (response) {
        if ([401].includes(response.status)) {
          window.location.href = '/login'
        } else if (response.data) {
          error.message =
            response.data.message ||
            response.data.reason ||
            response.data.errorMessage ||
            response.data ||
            `Network error with status ${response.status}`
        }
      } else {
        error.message = error?.message || 'Error jaringan. Harap dicoba kembali'
      }

      return Promise.reject(error)
    }
  )

  return instance
}

export const api = Request(API_URL as string, cookieNames.USER_ACCESS_TOKEN)
