import { Box, Stack } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import Sidebar from '../../components/shared/Sidebar'
import AuthProvider from '../../context/auth/Provider'
import SessionProvider from '../../context/session/Provider'

export default function DashboardLayout() {
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
              <Sidebar />
              <Box sx={{ flex: 1, p: 2, overflow: 'auto', display: 'flex' }}>
                <Outlet />
              </Box>
            </Stack>
          </Box>
        </Box>
      </SessionProvider>
    </AuthProvider>
  )
}
