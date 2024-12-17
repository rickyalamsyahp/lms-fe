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
    <div  style={{ cursor: 'pointer' }} // Untuk kursor tangan
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'lightgray')}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
      <Stack flexDirection="row" alignItems="center">
        {!isMobile && (
          <Stack alignItems={'flex-end'} sx={{ mr: 2 }}>
            <Typography>{profile?.data?.name.split(' ')[0]}</Typography>
            <Typography color="GrayText" fontSize={12}>
              {profile?.data?.bio?.identityNumber}
            </Typography>
          </Stack>
        )}
        <div onClick={(e: any) => handleClick(e)} >
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
        <MenuItem onClick={handleLogout} >
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  )
}
