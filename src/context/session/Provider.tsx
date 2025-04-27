import { useMediaQuery, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { useProfile } from '../auth/__shared/api'
import { User } from '../auth/__shared/type'
import { Context } from './context'

export default function SessionProvider(props: any) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [state, setState] = useState<
    {
      profile?: User
      isAdmin: boolean
      isTrainee: boolean
      isInstructor: boolean
    } & any
  >({})
  const profile = useProfile()

  function handleChangeState(key: string, value: any) {
    setState((current: any) => {
      current[key as keyof typeof current] = value
      return { ...current }
    })
  }

  useEffect(() => {
    if (profile.data && !state.profile) {
      const { role } = profile.data

      handleChangeState('profile', profile.data)
      handleChangeState(role === 'guru' ? 'isInstructor' : 'isTrainee', true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  return (
    <Context.Provider value={{ isMobile, state, setState: handleChangeState }}>
      {props.children}
    </Context.Provider>
  )
}
