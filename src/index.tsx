import { Worker } from '@react-pdf-viewer/core'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './ErrorPage'
import './index.css'
import LoginPage from './modules/auth/Login'
import CourseDetail from './modules/dashboard/course/CourseDetail'
import CourseList from './modules/dashboard/course/CourseList'
import ExamList from './modules/dashboard/exam/ExamList'
import ExamListDetail from './modules/dashboard/exam/ExamListDetail'
import DashboardLayout from './modules/dashboard/Layout'
import ExamAnalytics from './modules/dashboard/result/ExamAnalitic'
import CourseExamList from './modules/dashboard/result/ResultList'
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
        path: '/dashboard/course',
        element: <CourseList />,
      },
      {
        path: '/dashboard/course/:id',
        element: <CourseDetail />,
      },
      {
        path: '/dashboard/result',
        element: <CourseExamList />,
      },
      {
        path: '/dashboard/exam',
        element: <ExamList />,
      },
      {
        path: '/dashboard/exam/:id',
        element: <ExamListDetail />,
      },
      {
        path: '/dashboard/result/:id',
        element: <ExamAnalytics />,
      },
      {
        path: '/dashboard/user',
        element: <UserList />,
      },
    ],
  },
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <Worker workerUrl={`/pdf.worker.min.js`}>
      <Toaster />
      <RouterProvider router={router} />
    </Worker>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
