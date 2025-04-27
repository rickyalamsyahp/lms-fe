/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { Box, Card, Grid, Stack, Typography } from '@mui/material'
import Commandbar from '../../../components/shared/Commandbar'
import { useSession } from '../../../context/session'

import dayGridPlugin from '@fullcalendar/daygrid'
import FullCalendar from '@fullcalendar/react'
import { useCourseList } from '../course/__shared/api'

export default function UserList() {
  const { isMobile, state } = useSession()

  const { data: courseList, mutate: refetch } = useCourseList({
    page: 1,
    size: 50,
    ...(state.isTrainee && { kodeKelas: state.profile?.kodeKelas }),
    ...(state.isInstructor && { teacherId: state.profile?.kode }),
    // order: 'asc',
    // orderBy: 'level',
    // 'published:eq': true,
  })
  const examData =
    courseList?.results?.map((course: any) => ({
      subject: course.subject?.nama || '',
      date: new Date(course.scheduledAt).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: course.jamUjian || 'TBD',
    })) || []

  // Menyiapkan events untuk kalender
  const events =
    courseList?.results?.map((course: any) => ({
      title: course.subject?.nama || '',
      date: course.scheduledAt,
    })) || []

  return (
    <>
      <Stack sx={{ flex: 1 }}>
        <Commandbar />

        <Box sx={{ flex: 1, px: isMobile ? 1 : 2 }}>
          <Box sx={{ p: isMobile ? 2 : 4 }}>
            <Typography
              variant={isMobile ? 'subtitle1' : 'h6'}
              gutterBottom
              sx={{ textAlign: isMobile ? 'center' : 'left' }}
            >
              Selamat datang di Learning management system SMKN57 Jakarta
            </Typography>

            <Grid
              container
              spacing={isMobile ? 1 : 2}
              sx={{ mb: isMobile ? 2 : 4 }}
            >
              {examData.map((exam: any, i: any) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Card
                    sx={{
                      p: isMobile ? 1.5 : 2,
                      backgroundColor: '#ff7043',
                      color: 'white',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant={isMobile ? 'body1' : 'subtitle1'}>
                      {exam.subject}
                    </Typography>
                    <Typography variant="body2" mt={0.5}>
                      📅 {exam.date}
                    </Typography>
                    <Typography variant="body2">⏰ {exam.time}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Kalender */}
            <Box
              className="bg-white p-4 rounded-xl shadow-md"
              sx={{
                p: isMobile ? 1 : 4,
                '.fc .fc-toolbar': {
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? 1 : 0,
                },
                '.fc .fc-toolbar-title': {
                  fontSize: isMobile ? '1rem' : '1.25rem',
                },
                '.fc .fc-button': {
                  padding: isMobile ? '0.2rem 0.4rem' : '0.4rem 0.65rem',
                  fontSize: isMobile ? '0.7rem' : '0.8rem',
                },
                '.fc .fc-daygrid-day-number': {
                  fontSize: isMobile ? '0.7rem' : '0.9rem',
                },
                '.fc-event-title': {
                  fontSize: isMobile ? '0.7rem' : '0.9rem',
                },
              }}
            >
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView={isMobile ? 'dayGridMonth' : 'dayGridMonth'}
                headerToolbar={
                  isMobile
                    ? {
                        left: 'title',
                        center: '',
                        right: 'prev,next',
                      }
                    : {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,dayGridWeek',
                      }
                }
                height={isMobile ? 'auto' : undefined}
                events={events}
              />

              {/* Info tambahan */}
              <Box sx={{ mt: 2, px: isMobile ? 1 : 2 }}>
                {examData.map((exam: any, i: any) => (
                  <Typography
                    key={i}
                    variant="body2"
                    mt={1}
                    sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                  >
                    <strong>{exam.date}</strong> = Ujian online {exam.subject}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Stack>
    </>
  )
}
