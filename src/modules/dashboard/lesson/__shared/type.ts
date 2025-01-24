import { FileMeta } from '../../../filemeta/__shared/type'

export type Lesson = {
  id?: string
  description?: string
  title?: string
  file?: File | null
  category?: string
  createdBy?: string
  createdAt?: Date
  modifiedBy?: string
  modifiedAt?: Date
  fileMeta?: FileMeta
  published?: boolean
}
