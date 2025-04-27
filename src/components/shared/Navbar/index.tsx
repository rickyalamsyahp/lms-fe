import { Menu } from '@mui/icons-material'
import { IconButton, Stack } from '@mui/material'
import { useSession } from '../../../context/session/context'
import { LOGO2 } from '../../../libs/env'
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
        flex: 'none',
        height: 60,
        background: 'white',
        px: 2,
        borderBottom: 'thin solid #0000002A',
        top: 1,
      }}
    >
      <Stack flexDirection="row" alignItems="center">
        {isMobile && (
          <IconButton onClick={handleOpenSidebar}>
            <Menu />
          </IconButton>
        )}
        <img src={LOGO2} width={200} height={200} alt="logo" />
        {/* {!isMobile && (
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 500 }}>
            {TITLE}
          </Typography>
        )} */}
      </Stack>
      <Profile />
    </Stack>
  )
}
