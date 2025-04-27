import { CircularProgress } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  cookieNames,
  deleteAccessToken,
  options,
  setUrlPrefix,
} from '../../libs/http'
import { useProfile } from './__shared/api'
import { ScopeSlug } from './__shared/type'
import { Context } from './context'

export default function AuthProvider(props: any) {
  const navigate = useNavigate()

  const [ready, setReady] = useState(false)
  const { data: user } = useProfile(
    {
      onSuccess: (res) => {
        console.log(res.data)
        setUrlPrefix(res.data.scope)
        if (res.data && !ready) {
          setReady(true)
          const { scope } = res.data
          options.setScope(scope as ScopeSlug)
          navigate(`/dashboard/user`)
        }
      },
    },
    !ready
  )

  function handleLogout() {
    deleteAccessToken(cookieNames.USER_ACCESS_TOKEN)
    navigate(`/login`)
  }

  return (
    <Context.Provider value={{ user, logout: handleLogout }}>
      {ready ? props.children : <CircularProgress sx={{ m: 2 }} />}
    </Context.Provider>
  )
}
