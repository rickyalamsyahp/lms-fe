/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Replay } from '@mui/icons-material'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Commandbar from '../../../components/shared/Commandbar'
import DataTable from '../../../components/shared/DataTable'
import { DialogConfirm } from '../../../components/shared/Dialog/DialogConfirm'
import InfiniteScroll from '../../../components/shared/InfiniteScroll'
import { useSession } from '../../../context/session'
import FileViewer from '../../filemeta/__components/FileViewer'
import CourseExamForm from './__components/CourseExamForm'
import { deleteExam, useCourseExamList } from './__shared/api'
import { CourseExam } from './__shared/type'

export default function CourseListExam() {
  const { isMobile, state } = useSession()
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [showForm, setShowForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<CourseExam | undefined>()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showFile, setShowFile] = useState(false)
  const { courseId } = useParams()

  const query = {
    page,
    size,
  }

  const { data: examList, mutate: refetch } = useCourseExamList(
    state.profile?.scope,
    {
      ...query,
    }
  )

  // function handleOpenCourseExam(d: CourseExam) {
  //   setSelectedItem(d)
  //   setShowFile(true)
  // }

  async function handleDelete() {
    try {
      await deleteExam(selectedItem?.id as string)
      refetch()
    } catch (error) {
      throw error
    }
  }
  const formatDate = (dateString: any) => {
    const date = new Date(dateString)

    // Using Intl.DateTimeFormat for custom formatting
    const formatter = new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long', // 'long' will give you the full month name
      day: 'numeric',
      hour12: false, // 24-hour format
    })

    const formattedDate = formatter.format(date)

    return formattedDate
  }
  return (
    <>
      <Stack sx={{ flex: 1 }}>
        <Commandbar
          title={'Hasil Ujian'}
          // searchProps={{
          //   onSearch: (newSearch) => setSearch(newSearch),
          //   placeholder: 'Cari Pelatihan...',
          // }}
          breadcrumbsProps={{
            items: [
              {
                label: 'Menu Utama',
              },
            ],
          }}
          rightAddon={
            !state.isTrainee && (
              <>
                <IconButton
                  onClick={() => refetch()}
                  sx={{ mr: isMobile ? 0 : 2 }}
                >
                  <Replay />
                </IconButton>
                {/* {isMobile ? (
                  <IconButton onClick={() => setShowForm(true)} color="primary">
                    <Add />
                  </IconButton>
                ) : (
                  <Button
                    startIcon={<Add />}
                    variant="contained"
                    onClick={() => setShowForm(true)}
                  >
                    Tambah
                  </Button>
                )} */}
              </>
            )
          }
        />
        <Box sx={{ flex: 1, px: 2 }}>
          {isMobile ? (
            <InfiniteScroll>
              <Stack sx={{ gap: 1, py: 2 }}>
                {/* {userList?.results.map((d: Course) => (
                  <UserCard
                    key={d.id}
                    data={d}
                    onClick={() => {
                      setSelectedItem(d)
                      setShowForm(true)
                    }}
                  />
                ))} */}
              </Stack>
            </InfiniteScroll>
          ) : (
            <DataTable
              data={examList?.results}
              loading={!examList}
              columns={[
                {
                  label: 'Nama Siswa',
                  render: (item: any) => (
                    <Typography>{item.student?.nama}</Typography>
                  ),
                },
                {
                  label: 'Tanggal Ujian',
                  render: (item: any) => (
                    <Typography sx={{ minWidth: 160 }}>
                      {formatDate(item.questionBank.scheduledAt)}{' '}
                    </Typography>
                  ),
                },
                {
                  label: 'Mata Pelajaran',
                  render: (item: any) => (
                    <Typography sx={{ minWidth: 160 }}>
                      {item.questionBank.subject.nama}
                    </Typography>
                  ),
                },
                {
                  label: 'Durasi Ujian',
                  render: (item: any) => (
                    <Typography> {item.questionBank.duration} Menit</Typography>
                  ),
                },
                {
                  label: 'Kelas',
                  render: (item: any) => (
                    <Typography sx={{ minWidth: 120 }}>
                      {item.questionBank.classroom.nama}
                    </Typography>
                  ),
                },
                {
                  label: 'Jurusan',
                  render: (item: any) => (
                    <Typography sx={{ minWidth: 120 }}>
                      {item.questionBank.classroom.jurusans.nama}
                    </Typography>
                  ),
                },
                {
                  label: 'Semester',
                  render: (item: any) => (
                    <Typography sx={{ minWidth: 160 }}>
                      {item.questionBank.semester}
                    </Typography>
                  ),
                },
                {
                  label: 'Nama Guru',
                  render: (item: any) => (
                    <Typography sx={{ minWidth: 160 }}>
                      {item.questionBank.teacher.nama}
                    </Typography>
                  ),
                },
                {
                  label: 'Nilai',
                  render: (item: any) => (
                    <Typography sx={{ minWidth: 160 }}>{item.score}</Typography>
                  ),
                },
              ]}
              paginationProps={{
                rowsPerPageOptions: [10, 25, 50],
                rowsPerPage: size,
                count: Number(examList?.total || 0),
                page,
                onPageChange: (e, value) => setPage(value + 1),
                onRowsPerPageChange: (e) => {
                  setSize(Number(e.target.value))
                  setPage(1)
                },
              }}
            />
          )}
        </Box>
      </Stack>
      <CourseExamForm
        courseId={courseId as string}
        isOpen={showForm}
        initialData={selectedItem}
        onClose={() => {
          setShowForm(false)
          setTimeout(() => setSelectedItem(undefined), 500)
        }}
        onSuccess={refetch}
      />
      <DialogConfirm
        open={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setSelectedItem(undefined)
        }}
        title="Delete"
        content={`Yakin menghapus pelatihan ini?`}
        onSubmit={handleDelete}
      />
      <FileViewer
        fileMeta={selectedItem?.fileMeta}
        open={showFile}
        onClose={() => {
          setShowFile(false)
          setSelectedItem(undefined)
        }}
      />
    </>
  )
}
