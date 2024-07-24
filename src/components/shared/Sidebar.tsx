import {
  AccountBalance,
  Apps,
  CalendarMonth,
  Contacts,
  Groups,
  HealthAndSafety,
  LocationCity,
  Notes,
  Person,
  Tv,
  WorkHistory,
} from '@mui/icons-material'
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
  scope?: ScopeSlug
  activeRegex?: RegExp
}

const menuList: MenuItemProps[] = [
  {
    menuType: MenuItemType.DIVIDER,
    label: 'Master',
  },
  {
    menuType: MenuItemType.LINK,
    label: 'Pengguna',
    icon: <Person fontSize="small" />,
    href: '/dashboard/user',
    activeRegex: /.*user/gi,
    scope: ScopeSlug.ADMIN,
  },
  {
    menuType: MenuItemType.LINK,
    label: 'Fraksi',
    icon: <AccountBalance fontSize="small" />,
    href: '/dashboard/faction',
    activeRegex: /.*faction/gi,
    scope: ScopeSlug.ADMIN,
  },
  {
    menuType: MenuItemType.LINK,
    label: 'Grup',
    icon: <Groups fontSize="small" />,
    href: '/dashboard/group',
    activeRegex: /.*group/gi,
    scope: ScopeSlug.ADMIN,
  },
  {
    menuType: MenuItemType.LINK,
    label: 'Dapil',
    icon: <LocationCity fontSize="small" />,
    href: '/dashboard/dapil',
    activeRegex: /.*dapil/gi,
    scope: ScopeSlug.ADMIN,
  },
  {
    menuType: MenuItemType.DIVIDER,
    label: 'Menu Informasi',
  },
  {
    menuType: MenuItemType.LINK,
    label: 'TV Parlemen',
    icon: <Tv fontSize="small" />,
    href: '/dashboard/tvparlemen',
    activeRegex: /.*tvparlemen/gi,
    scope: ScopeSlug.ADMIN,
  },
  {
    menuType: MenuItemType.LINK,
    label: 'Agenda',
    icon: <CalendarMonth fontSize="small" />,
    href: '/dashboard/agenda',
    activeRegex: /.*agenda/gi,
    scope: ScopeSlug.ADMIN,
  },
  {
    menuType: MenuItemType.LINK,
    label: 'Kontak',
    icon: <Contacts fontSize="small" />,
    href: '/dashboard/contact',
    activeRegex: /.*contact/gi,
    scope: ScopeSlug.ADMIN,
  },
  {
    menuType: MenuItemType.LINK,
    label: 'Artikel',
    icon: <Notes fontSize="small" />,
    href: '/dashboard/article',
    activeRegex: /.*article/gi,
    scope: ScopeSlug.ADMIN,
  },
  {
    menuType: MenuItemType.LINK,
    label: 'Referensi',
    icon: <Apps fontSize="small" />,
    href: '/dashboard/reference',
    activeRegex: /.*reference/gi,
    scope: ScopeSlug.ADMIN,
  },
  /*{
    menuType: MenuItemType.LINK,
    label: 'Profil',
    icon: <Info fontSize="small" />,
    href: '/dashboard/organization/[organizationId]/profile',
    activeRegex: /.*profile/gi,
    scope: ScopeSlug.INSTRUCTOR,
  },
  */
  {
    menuType: MenuItemType.DIVIDER,
    label: 'DPR',
  },
  {
    menuType: MenuItemType.LINK,
    label: 'Kinerja',
    icon: <HealthAndSafety fontSize="small" />,
    href: '/dashboard/performance',
    activeRegex: /.*performance/gi,
    scope: ScopeSlug.ADMIN,
  },
  {
    menuType: MenuItemType.LINK,
    label: 'Masa Bakti',
    icon: <WorkHistory fontSize="small" />,
    href: '/dashboard/period',
    activeRegex: /(.*period)|(.*member)/gi,
    scope: ScopeSlug.ADMIN,
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
              if (!each.scope) return true
              else
                return (
                  (each.scope as string) === (profile?.data?.scope as string)
                )
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
