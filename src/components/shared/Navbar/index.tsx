import { Menu } from '@mui/icons-material'
import { IconButton, Stack, Typography } from '@mui/material'
import { useSession } from '../../../context/session/context'
import Profile from './__components/Profile'

export default function Navbar() {
  const { isMobile, state, setState } = useSession()

  function handleOpenSidebar() {
    setState('openSidebar', !state.openSidebar)
  }

  return (
    <Stack
      alignItems="center"
      flexDirection="row"
      justifyContent="space-between"
      sx={{
        height: 60,
        background: 'white',
        px: 2,
        borderBottom: 'thin solid #0000002A',
      }}
    >
      <Stack flexDirection="row" alignItems="center">
        {isMobile && (
          <IconButton onClick={handleOpenSidebar}>
            <Menu />
          </IconButton>
        )}
        <img src="/logo.svg" width={40} height={40} alt="logo" />
        {!isMobile && (
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 500 }}>
            Internal Dashboard
          </Typography>
        )}
      </Stack>
      <Profile />
    </Stack>
  )
}
