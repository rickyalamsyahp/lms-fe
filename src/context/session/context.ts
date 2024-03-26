import { createContext, useContext } from 'react'

type SessionContext = {
  isMobile: boolean
  state: any
  setState: (_key: string, _value: any) => void
}

export const Context = createContext<SessionContext>({
  isMobile: false,
  state: {},
  setState: (_key: string, _value: any) => {
    return
  },
})

export const useSession = () => useContext(Context)
