import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './ErrorPage'
import './index.css'
import LoginPage from './modules/auth/Login'
import DashboardLayout from './modules/dashboard/Layout'
import Report from './modules/dashboard/report/Report'
import SubmissionList from './modules/dashboard/submission/SubmissionList'
import UserDetail from './modules/dashboard/user/UserDetail'
import UserDetailOverview from './modules/dashboard/user/UserDetailOverview'
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
            element: <UserDetailOverview />,
          },
        ],
      },
    ],
  },
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
