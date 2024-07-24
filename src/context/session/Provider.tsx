import { useEffect, useState } from 'react'
import { useProfile } from '../auth/__shared/api'
import { ScopeSlug, User } from '../auth/__shared/type'
import { Context } from './context'

export default function SessionProvider(props: any) {
  const isMobile = false //useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
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
    if (profile.data) {
      const { scope } = profile.data
      handleChangeState('profile', profile.data)
      handleChangeState(
        scope === ScopeSlug.ADMIN
          ? 'isAdmin'
          : scope === ScopeSlug.INSTRUCTOR
            ? 'isInstructor'
            : 'isTrainee',
        true
      )
    }
  }, [profile])

  return (
    <Context.Provider value={{ isMobile, state, setState: handleChangeState }}>
      {props.children}
    </Context.Provider>
  )
}
