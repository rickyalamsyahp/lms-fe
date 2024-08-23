import { FileMeta } from '../../../filemeta/__shared/type'

export type Submission = {
  id?: string
  courseId?: string
  courseExamId?: string
  owner?: string
  status?: string
  objectType?: string
  score?: string
  exam?: object
  createdBy?: string
  createdAt?: Date
  modifiedBy?: string
  modifiedAt?: Date
}

export type SubmissionReport = {
  id?: string
  tag: string
  fileMeta: FileMeta
  createdBy?: string
  createdAt?: Date
  modifiedBy?: string
  modifiedAt?: Date
}
