import { Delete } from '@mui/icons-material'
import { Box, Button, IconButton, Stack, Tab, Tabs } from '@mui/material'
import { SyntheticEvent, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import Commandbar from '../../../components/shared/Commandbar'
import { DialogConfirm } from '../../../components/shared/Dialog/DialogConfirm'
import { useSession } from '../../../context/session'
import { ellipsis } from '../../../libs/utils'
import { deleteUser, useCourse } from './__shared/api'

export default function CourseDetail() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { courseId } = useParams()
  const { isMobile, state } = useSession()
  const { data: user } = useCourse(courseId as string)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [tab, setTab] = useState<string>(
    pathname.replace(`/dashboard/course/${courseId}/`, '')
  )

  function handleTabChange(e: SyntheticEvent, newTab: string) {
    setTab(newTab)
    navigate(`/dashboard/course/${courseId}/${newTab}`)
  }

  async function handleDelete() {
    try {
      await deleteUser(courseId as string)
      navigate('/dashboard/user')
    } catch (error) {
      throw error
    }
  }

  return (
    <>
      <Stack sx={{ flex: 1 }}>
        <Commandbar
          title={
            user?.description
              ? ellipsis(user.description, isMobile ? 24 : 48)
              : '...'
          }
          breadcrumbsProps={{
            items: [
              {
                label: 'Menu Utama',
              },
              {
                label: 'Modul Pembelajaran',
                path: '/dashboard/course',
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
        <Tabs
          value={tab}
          variant={isMobile ? 'fullWidth' : undefined}
          onChange={handleTabChange}
        >
          <Box sx={{ borderColor: 'thin solid divider' }} />
          <Tab label="Overview" value="overview" />
          <Tab label="Pelatihan" value="exam" />
        </Tabs>
        <Box sx={{ flex: 1, position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Outlet />
          </Box>
        </Box>
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
