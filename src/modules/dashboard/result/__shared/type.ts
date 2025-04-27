import { FileMeta } from '../../../filemeta/__shared/type'

export type CourseExam = {
  id?: string
  courseId?: string
  description?: string
  title?: string
  level?: string
  file?: File | null
  createdBy?: string
  createdAt?: Date
  modifiedBy?: string
  modifiedAt?: Date
  fileMeta?: FileMeta
}

export type CourseExamSetting = {
  id?: string
  courseExamId?: string
  name?: string
  type?: string
  template?: string
  createdBy?: string
  createdAt?: Date
  modifiedBy?: string
  modifiedAt?: Date
}
