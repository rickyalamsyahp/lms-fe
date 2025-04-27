import { Box, Stack } from '@mui/material'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import Sidebar from '../../components/shared/Sidebar'
import { useProfile } from '../../context/auth/__shared/api'
import { ScopeSlug } from '../../context/auth/__shared/type'
import AuthProvider from '../../context/auth/Provider'
import SessionProvider from '../../context/session/Provider'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const profile = useProfile()
  const location = useLocation()

  useEffect(() => {
    if (
      profile?.data?.role !== ScopeSlug.STUDENT &&
      location.pathname === '/dashboard'
    )
      navigate('/dashboard/user')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  return (
    <AuthProvider>
      <SessionProvider>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
          }}
        >
          <Navbar />
          <Box sx={{ flex: 1, position: 'relative' }}>
            <Stack
              flexDirection={'row'}
              sx={{ position: 'absolute', height: '100%', width: '100%' }}
            >
              {/* {profile?.data?.role !== ScopeSlug.STUDENT && <Sidebar />} */}
              <Sidebar />
              <Box sx={{ flex: 1, p: 2, overflow: 'auto', display: 'flex' }}>
                <Outlet />
                {/* {profile?.data?.role === ScopeSlug.STUDENT ? (
                  <Container maxWidth={'lg'}>
                    <UserDetailReport user={profile?.data} />
                  </Container>
                ) : (
                  <Outlet />
                )} */}
              </Box>
            </Stack>
          </Box>
        </Box>
      </SessionProvider>
    </AuthProvider>
  )
}
