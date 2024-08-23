import { Box, Stack, Tab, Tabs } from '@mui/material'
import { SyntheticEvent, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import Commandbar from '../../../components/shared/Commandbar'
import { DialogConfirm } from '../../../components/shared/Dialog/DialogConfirm'
import Sidebar from '../../../components/shared/Sidebar'
import { useSession } from '../../../context/session'
import { ellipsis } from '../../../libs/utils'
import { deleteExam, useSubmission } from './__shared/api'

export default function UserDtail() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { submissionId } = useParams()

  const { isMobile, state } = useSession()
  const { data: exam } = useSubmission(
    state.profile.scope,
    submissionId as string
  )
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [tab, setTab] = useState<string>(
    pathname.replace(`/dashboard/submission/${submissionId}/`, '')
  )

  function handleTabChange(e: SyntheticEvent, newTab: string) {
    setTab(newTab)
    navigate(`/dashboard/submission/${submissionId}/${newTab}`)
  }

  async function handleDelete() {
    try {
      await deleteExam(submissionId as string)
      navigate('/dashboard/submission')
    } catch (error) {
      throw error
    }
  }

  return (
    <>
      <Stack sx={{ flex: 1 }}>
        <Commandbar
          title={exam?.owner ? ellipsis(exam.owner, isMobile ? 24 : 48) : '...'}
          breadcrumbsProps={{
            items: [
              {
                label: 'Submission',
                path: '/dashboard/submission',
              },
            ],
          }}
        />
        {state.isAdmin || state.isInstructor ? (
          <>
            <Tabs
              value={tab}
              variant={isMobile ? 'fullWidth' : undefined}
              onChange={handleTabChange}
            >
              <Box sx={{ borderColor: 'thin solid divider' }} />
              <Tab label="Overview" value="overview" />
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
