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
import { useProfile } from '../../../../context/auth/__shared/api'
import { useSession } from '../../../../context/session'
import { getUserAvatarUrl } from '../../../../modules/dashboard/user/__shared/api'

export default function Profile() {
  const { isMobile } = useSession()
  const { logout } = useAuth()
  const profile = useProfile()
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
    <div
      style={{
        cursor: 'pointer',
        padding: '8px', // Default padding
        transition: 'background-color 0.3s, padding 0.3s', // Smooth transition for background and padding
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'lightgray'
        e.currentTarget.style.padding = '12px' // Add more padding on hover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
        e.currentTarget.style.padding = '8px' // Reset padding when not hovering
      }}
    >
      <Stack flexDirection="row" alignItems="center">
        {!isMobile && (
          <Stack alignItems={'flex-end'} sx={{ mr: 2 }}>
            <Typography>{profile?.data?.name.split(' ')[0]}</Typography>
            <Typography color="GrayText" fontSize={12}>
              {profile?.data?.bio?.identityNumber}
            </Typography>
          </Stack>
        )}
        <div onClick={(e: any) => handleClick(e)}>
          <Avatar
            src={
              profile?.data?.avatar
                ? getUserAvatarUrl(profile?.data.id as string)
                : '/image/default-avatar.png'
            }
          />
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
    </div>
  )
}
