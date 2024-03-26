import { Logout } from '@mui/icons-material'
import {
  Avatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useAuth } from '../../../../context/auth'
import { useSession } from '../../../../context/session'

export default function Profile() {
  const { isMobile } = useSession()
  const { user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const showMenu = Boolean(anchorEl)

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  function handleLogout() {
    logout()
    handleClose()
  }

  return (
    <>
      <Stack flexDirection="row" alignItems="center">
        {!isMobile && (
          <Typography sx={{ mr: 2 }}>{user?.name.split(' ')[0]}</Typography>
        )}
        <div onClick={(e: any) => handleClick(e)}>
          <Avatar src="/image/default-avatar.png" />
        </div>
      </Stack>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={showMenu}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}
