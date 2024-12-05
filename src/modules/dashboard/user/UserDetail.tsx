import { Delete } from '@mui/icons-material'
import { Box, Button, IconButton, Stack, Tab, Tabs } from '@mui/material'
import { SyntheticEvent, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import Commandbar from '../../../components/shared/Commandbar'
import { DialogConfirm } from '../../../components/shared/Dialog/DialogConfirm'
import Sidebar from '../../../components/shared/Sidebar'
import { ScopeSlug } from '../../../context/auth/__shared/type'
import { useSession } from '../../../context/session'
import { ellipsis } from '../../../libs/utils'
import { deleteUser, useUser } from './__shared/api'

export default function UserDtail() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { userId } = useParams()
  const { isMobile, state } = useSession()
  const { data: user } = useUser(userId as string)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [tab, setTab] = useState<string>(
    pathname.replace(`/dashboard/user/${userId}/`, '')
  )

  function handleTabChange(e: SyntheticEvent, newTab: string) {
    setTab(newTab)
    navigate(`/dashboard/user/${userId}/${newTab}`)
  }

  async function handleDelete() {
    try {
      await deleteUser(userId as string, state as any)
      navigate('/dashboard/user')
    } catch (error) {
      throw error
    }
  }

  return (
    <>
      <Stack sx={{ flex: 1 }}>
        <Commandbar
          title={user?.name ? ellipsis(user.name, isMobile ? 24 : 48) : '...'}
          breadcrumbsProps={{
            items: [
              {
                label: 'Pengguna',
                path: '/dashboard/user',
              },
            ],
          }}
          rightAddon={
            <>
              {state.isAdmin &&
                (isMobile ? (
                  <IconButton
                    color="warning"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Delete />
                  </IconButton>
                ) : (
                  <Button
                    startIcon={<Delete />}
                    color="warning"
                    variant="contained"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Hapus
                  </Button>
                ))}
            </>
          }
        />
        {state.isAdmin || state.isInstructor ? (
          <>
            <Tabs
              value={tab}
              variant={isMobile ? 'fullWidth' : undefined}
              onChange={handleTabChange}
              sx={{ display: 'none' }}
            >
              <Box sx={{ borderColor: 'thin solid divider' }} />
              <Tab label="Overview" value="overview" />
              {user?.scope === ScopeSlug.TRAINEE && (
                <Tab label="Report" value="report" />
              )}
            </Tabs>
            <Box sx={{ flex: 1, position: 'relative' }}>
              <Box
                sx={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  overflow: 'auto',
                }}
              >
                <Outlet />
              </Box>
            </Box>
          </>
        ) : (
          <Stack
            flexDirection={'row'}
            sx={{ flex: 1, borderTop: 'thin solid #0000001A' }}
          >
            <Sidebar />
            <Box sx={{ flex: 1, position: 'relative' }}>
              <Box
                sx={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  overflow: 'auto',
                }}
              >
                <Outlet />
              </Box>
            </Box>
          </Stack>
        )}
      </Stack>
      <DialogConfirm
        open={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
        }}
        title="Hapus"
        content="Yakin menghapus akun pengguna ini?"
        onSubmit={handleDelete}
      />
    </>
  )
}
