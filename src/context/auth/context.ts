import { User } from './__shared/type'
import { createContext, useContext } from 'react'

type AuthContext = {
  user?: User
  logout: () => void
}

export const Context = createContext<AuthContext>({
  user: undefined,
  logout: () => {
    return
  },
})

export const useAuth = () => useContext(Context)
