/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Add, Delete, Details, Edit, Menu, Replay } from '@mui/icons-material'
import {
  Box,
  Button,
  Divider,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Commandbar from '../../../components/shared/Commandbar'
import DataTable from '../../../components/shared/DataTable'
import { DialogConfirm } from '../../../components/shared/Dialog/DialogConfirm'
import Dropdown from '../../../components/shared/Dropdown'
import InfiniteScroll from '../../../components/shared/InfiniteScroll'
import { useSession } from '../../../context/session'
import { options } from '../../../libs/http'
import FileViewer from '../../filemeta/__components/FileViewer'
import CourseExamForm from './__components/CourseExamForm'
import { deleteExam, useCourseExamList } from './__shared/api'
import { CourseExam } from './__shared/type'

type CourseExamListProps = {
  asPage?: boolean
}

export default function CourseListExam({ asPage }: CourseExamListProps) {
  const navigate = useNavigate()
  const { isMobile, state } = useSession()
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [search, setSearch] = useState<string>('')
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
    options.publicScope,
    {
      ...query,
      'title:likeLower': search ? `%${search}%` : undefined,
      'courseId:eq': courseId,
    }
  )

  function handleOpenCourseExam(d: CourseExam) {
    setSelectedItem(d)
    setShowFile(true)
  }

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
          title={asPage ? 'Daftar Pelatihan' : undefined}
          searchProps={{
            onSearch: (newSearch) => setSearch(newSearch),
            placeholder: 'Cari Pelatihan...',
          }}
          breadcrumbsProps={
            asPage
              ? {
                  items: [
                    {
                      label: 'Menu Utama',
                    },
                  ],
                }
              : undefined
          }
          rightAddon={
            !state.isTrainee && (
              <>
                <IconButton
                  onClick={() => refetch()}
                  sx={{ mr: isMobile ? 0 : 2 }}
                >
                  <Replay />
                </IconButton>
                {isMobile ? (
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
                )}
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
                  label: 'Title',
                  render: (item: CourseExam) =>
                    item.fileMeta ? (
                      <Link
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleOpenCourseExam(item)}
                      >
                        <Typography sx={{ minWidth: 160 }}>
                          {item.title}
                        </Typography>
                      </Link>
                    ) : (
                      <Typography sx={{ minWidth: 160 }}>
                        {item.title}
                      </Typography>
                    ),
                },
                {
                  label: 'Description',
                  render: (item: CourseExam) => (
                    <Typography
                      fontSize={12}
                      sx={{ mt: 0.5 }}
                      color="textSecondary"
                    >
                      {item.description}
                    </Typography>
                  ),
                },
                {
                  label: 'Description',
                  render: (item: CourseExam) => (
                    <Typography sx={{ minWidth: 160 }}>
                      {item.description}
                    </Typography>
                  ),
                },
                {
                  label: 'Level',
                  render: (item: CourseExam) => (
                    <Typography>{item.level}</Typography>
                  ),
                },
                {
                  label: 'Pembelajaran',
                  render: (item: any) => (
                    <Typography sx={{ minWidth: 120 }}>
                      {item.course?.title}
                    </Typography>
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
                {
                  label: 'Aksi',
                  render: (item: CourseExam) => (
                    <Dropdown
                      trigger={
                        <IconButton>
                          <Menu />
                        </IconButton>
                      }
                      menuList={
                        <>
                          <MenuItem
                            onClick={() => {
                              setSelectedItem(item)
                              setShowForm(true)
                            }}
                          >
                            <ListItemIcon>
                              <Edit />
                            </ListItemIcon>
                            <ListItemText>Edit</ListItemText>
                          </MenuItem>
                          <MenuItem
                            onClick={async () => {
                              navigate(`/dashboard/exam/${item.id}/overview`)
                            }}
                          >
                            <ListItemIcon>
                              <Details />
                            </ListItemIcon>
                            <ListItemText>Detail</ListItemText>
                          </MenuItem>
                          <Divider />
                          <MenuItem
                            onClick={() => {
                              setSelectedItem(item)
                              setShowDeleteConfirm(true)
                            }}
                          >
                            <ListItemIcon>
                              <Delete />
                            </ListItemIcon>
                            <ListItemText>Delete</ListItemText>
                          </MenuItem>
                        </>
                      }
                    />
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
