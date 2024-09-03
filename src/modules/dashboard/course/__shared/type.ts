import { FileMeta } from '../../../filemeta/__shared/type'

export type Course = {
  id?: string
  description?: string
  title?: string
  level?: string
  file?: File | null
  createdBy?: string
  createdAt?: Date
  modifiedBy?: string
  modifiedAt?: Date
  fileMeta?: FileMeta
  published?: boolean
}
