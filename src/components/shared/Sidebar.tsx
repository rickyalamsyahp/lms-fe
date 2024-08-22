import { AccountBalance, ListAlt, Person, Report } from '@mui/icons-material'
import {
  Box,
  Drawer,
  DrawerProps,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Stack,
  Typography,
} from '@mui/material'
import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useProfile } from '../../context/auth/__shared/api'
import { ScopeSlug } from '../../context/auth/__shared/type'
import { useSession } from '../../context/session'
import JumpingLoader from './JumpingLoader'

type SidebarProps = DrawerProps

enum MenuItemType {
  DIVIDER = 'divider',
  LINK = 'link',
}

type MenuItemProps = {
  menuType: MenuItemType
  label: string
  icon?: React.ReactNode
  href?: string
  scopes?: ScopeSlug[]
  activeRegex?: RegExp
}

const menuList: MenuItemProps[] = [
  {
    menuType: MenuItemType.DIVIDER,
    label: 'Menu Utama',
  },
  {
    menuType: MenuItemType.LINK,
    label: 'Pengguna',
    icon: <Person fontSize="small" />,
    href: '/dashboard/user',
    activeRegex: /.*user/gi,
    scopes: [ScopeSlug.ADMIN, ScopeSlug.INSTRUCTOR],
  },
  {
    menuType: MenuItemType.LINK,
    label: 'Modul Pembelajaran',
    icon: <AccountBalance fontSize="small" />,
    href: '/dashboard/course',
    activeRegex: /.*course/gi,
    scopes: [ScopeSlug.ADMIN, ScopeSlug.INSTRUCTOR],
  },
  {
    menuType: MenuItemType.LINK,
    label: 'Modul Pelatihan',
    icon: <ListAlt fontSize="small" />,
    href: '/dashboard/exam',
    activeRegex: /.*exam/gi,
    scopes: [ScopeSlug.ADMIN, ScopeSlug.INSTRUCTOR],
  },
  {
    menuType: MenuItemType.LINK,
    label: 'Submission',
    icon: <Report fontSize="small" />,
    href: '/dashboard/submission',
    activeRegex: /.*submission/gi,
    scopes: [ScopeSlug.ADMIN, ScopeSlug.INSTRUCTOR, ScopeSlug.TRAINEE],
  },
]

export default function Sidebar({ ...props }: SidebarProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const params: any = useParams()
  const { state, setState, isMobile } = useSession()
  const profile = useProfile()

  function handleClose() {
    setState('openSidebar', false)
  }

  function normalizePath(path: string) {
    const urlParams = path.match(/([\[].*?[\]])/gi)
    let result = path
    urlParams?.forEach((each) => {
      result = result.replace(
        each,
        params[each.replace(/(\[)|(\])/gi, '') as keyof typeof params]
      )
    })
    return result
  }

  const render = (
    <Stack
      sx={{
        background: 'transparent',
        width: 240,
        px: 2,
        height: '100%',
        overflow: 'auto',
      }}
    >
      {profile ? (
        <MenuList>
          {menuList
            .filter((each) => {
              if (!each.scopes) return true
              else
                return each.scopes.includes(profile?.data?.scope as ScopeSlug)
            })
            .map((d, i) => {
              const selected = String(pathname).match(
                new RegExp((d.activeRegex || d.href) as string)
              )
                ? true
                : false

              return d.menuType === MenuItemType.DIVIDER ? (
                <Typography
                  fontSize={12}
                  textTransform="uppercase"
                  letterSpacing={3}
                  fontWeight={600}
                  sx={{ opacity: 0.52, mt: 2, mb: 2 }}
                  key={`menu-${i}`}
                >
                  {d.label}
                </Typography>
              ) : (
                <Box
                  onClick={() => {
                    navigate(normalizePath(d.href as string))
                    handleClose()
                  }}
                  key={`menu` + i}
                >
                  <MenuItem
                    selected={selected}
                    sx={
                      selected
                        ? {
                            borderRight: '5px solid',
                            borderColor: 'primary.main',
                            // backgroundColor: 'transparent !important',
                          }
                        : undefined
                    }
                  >
                    {d.icon && <ListItemIcon>{d.icon}</ListItemIcon>}
                    <ListItemText>{d.label}</ListItemText>
                  </MenuItem>
                </Box>
              )
            })}
        </MenuList>
      ) : (
        <JumpingLoader />
      )}
    </Stack>
  )
  return isMobile ? (
    <Drawer open={state.openSidebar} {...props} onClose={handleClose}>
      {render}
    </Drawer>
  ) : (
    render
  )
}
