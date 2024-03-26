import { useState } from 'react'
import { Context } from './context'

export default function SessionProvider(props: any) {
  const isMobile = false //useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const [state, setState] = useState<any>({})

  function handleChangeState(key: string, value: any) {
    setState((current: any) => {
      current[key as keyof typeof current] = value
      return { ...current }
    })
  }
  return (
    <Context.Provider value={{ isMobile, state, setState: handleChangeState }}>
      {props.children}
    </Context.Provider>
  )
}
