/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Box, Link, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Commandbar from '../../../components/shared/Commandbar'
import DataTable from '../../../components/shared/DataTable'
import { DialogConfirm } from '../../../components/shared/Dialog/DialogConfirm'
import InfiniteScroll from '../../../components/shared/InfiniteScroll'
import { useSession } from '../../../context/session'
import UserForm from './__components/CourseExamForm'
import { deleteExam, useCourseExamList } from './__shared/api'
import { CourseExam } from './__shared/type'

export default function UserListExam() {
  const navigate = useNavigate()
  const { isMobile, state } = useSession()
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [search, setSearch] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<CourseExam | undefined>()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const query = {
    page,
    size,
  }

  const { data: examList, mutate: refetch } = useCourseExamList(
    state.profile.scope,
    {
      ...query,
      'title:likeLower': search ? `%${search}%` : undefined,
    }
  )
  useEffect(() => {
    refetch()
  }, [])
  async function handleDelete() {
    try {
      await deleteExam(selectedItem?.id as string)
      refetch()
    } catch (error) {
      throw error
    }
  }

  return (
    <>
      <Stack sx={{ flex: 1 }}>
        <Commandbar
          title="Daftar Course Exam"
          searchProps={{
            onSearch: (newSearch) => setSearch(newSearch),
            placeholder: 'Cari Course Exam...',
          }}
          breadcrumbsProps={{
            items: [
              {
                label: 'Kategori',
              },
            ],
          }}
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
                  label: 'Course ID',
                  render: (item: any) => (
                    <Typography>{item.courseId}</Typography>
                  ),
                },
                {
                  label: 'Title',
                  render: (item: CourseExam) => (
                    <Link
                      onClick={() =>
                        navigate(`/dashboard/exam/${item.id}/overview`)
                      }
                    >
                      <Typography color={'blue'}>{item.title}</Typography>
                    </Link>
                  ),
                },

                {
                  label: 'Description',
                  render: (item: CourseExam) => (
                    <Typography>{item.description}</Typography>
                  ),
                },
                {
                  label: 'Level',
                  render: (item: CourseExam) => (
                    <Typography>{item.level}</Typography>
                  ),
                },
                {
                  label: 'Dibuat',
                  render: (item: CourseExam) => (
                    <Typography>{item.createdBy}</Typography>
                  ),
                },
                {
                  label: 'Tanggal Dibuat',
                  render: (item: CourseExam) => (
                    <Typography sx={{ minWidth: 160 }}>
                      {dayjs(item.createdAt).format('DD MMM YYYY HH:mm:ss')}
                    </Typography>
                  ),
                },
              ]}
              paginationProps={{
                rowsPerPageOptions: [10, 25, 50],
                rowsPerPage: size,
                count: Number(examList?.total || 0),
                page,
                onPageChange: (e, value) => setPage(value),
                onRowsPerPageChange: (e) => setSize(Number(e.target.value)),
              }}
            />
          )}
        </Box>
      </Stack>
      <UserForm
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
        content={`Yakin menghapus course ini?`}
        onSubmit={handleDelete}
      />
    </>
  )
}
