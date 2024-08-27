import { Worker } from '@react-pdf-viewer/core'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './ErrorPage'
import './index.css'
import LoginPage from './modules/auth/Login'
import CourseDetail from './modules/dashboard/course/CourseDetail'
import CourseDetailOverview from './modules/dashboard/course/CourseDetailOverview'
import CourseList from './modules/dashboard/course/CourseList'
import CourseExamListDetail from './modules/dashboard/courseExam/CourseExamDetail'
import CourseExamListOverview from './modules/dashboard/courseExam/CourseExamDetailOverview'
import CourseExamListPenilaian from './modules/dashboard/courseExam/CourseExamDetailPenilaian'
import CourseExamListSetting from './modules/dashboard/courseExam/CourseExamDetailSetting'
import CourseExamList from './modules/dashboard/courseExam/CourseExamList'
import DashboardLayout from './modules/dashboard/Layout'
import Report from './modules/dashboard/report/Report'
import SubmissionDetail from './modules/dashboard/submission/SubmissionExamDetail'
import SubmissionDetailOverview from './modules/dashboard/submission/SubmissionExamDetailOverview'
import SubmissionList from './modules/dashboard/submission/SubmissionList'
import UserDetail from './modules/dashboard/user/UserDetail'
import UserDetailReport from './modules/dashboard/user/UserDetailReport'
import UserList from './modules/dashboard/user/UserList'
import reportWebVitals from './reportWebVitals'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/dashboard/submission',
        element: <SubmissionList />,
      },
      {
        path: '/dashboard/submission/:submissionId',
        element: <SubmissionDetail />,
        children: [
          {
            path: '/dashboard/submission/:submissionId/overview',
            element: <SubmissionDetailOverview />,
          },
        ],
      },
      {
        path: '/dashboard/course',
        element: <CourseList />,
      },
      {
        path: '/dashboard/course/:courseId',
        element: <CourseDetail />,
        children: [
          {
            path: '/dashboard/course/:courseId/overview',
            element: <CourseDetailOverview />,
          },
          {
            path: '/dashboard/course/:courseId/exam',
            element: <CourseExamList asPage={false} />,
          },
        ],
      },
      {
        path: '/dashboard/exam',
        element: <CourseExamList />,
      },
      {
        path: '/dashboard/exam/:examId',
        element: <CourseExamListDetail />,
        children: [
          {
            path: '/dashboard/exam/:examId/overview',
            element: <CourseExamListOverview />,
          },
          {
            path: '/dashboard/exam/:examId/setting',
            element: <CourseExamListSetting />,
          },
          {
            path: '/dashboard/exam/:examId/penilaian',
            element: <CourseExamListPenilaian />,
          },
        ],
      },
      {
        path: '/dashboard/report',
        element: <Report />,
      },
      {
        path: '/dashboard/user',
        element: <UserList />,
      },
      {
        path: '/dashboard/user/:userId',
        element: <UserDetail />,
        children: [
          {
            path: '/dashboard/user/:userId/overview',
            element: <UserDetailReport />,
          },
          // {
          //   path: '/dashboard/user/:userId/report',
          //   element: <UserDetailReport />,
          // },
        ],
      },
    ],
  },
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <Toaster />
      <RouterProvider router={router} />
    </Worker>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
