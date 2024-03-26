import { useNavigate } from 'react-router-dom'
import { cookieNames, deleteAccessToken, setUrlPrefix } from '../../libs/http'
import { useUser } from './__shared/api'
import { Context } from './context'

export default function AuthProvider(props: any) {
  const { data: user } = useUser({
    onSuccess: (res) => {
      setUrlPrefix(res.data.scope)
    },
  })
  const navigate = useNavigate()

  function handleLogout() {
    deleteAccessToken(cookieNames.USER_ACCESS_TOKEN)
    navigate(`/login`)
  }

  return (
    <Context.Provider value={{ user, logout: handleLogout }}>
      {props.children}
    </Context.Provider>
  )
}
