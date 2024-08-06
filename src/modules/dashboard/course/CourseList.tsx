/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Add, Delete, Edit, Menu, Replay } from '@mui/icons-material'
import {
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
// import toast from 'react-hot-toast'
import Commandbar from '../../../components/shared/Commandbar'
import DataTable from '../../../components/shared/DataTable'
import { DialogConfirm } from '../../../components/shared/Dialog/DialogConfirm'
import Dropdown from '../../../components/shared/Dropdown'
import InfiniteScroll from '../../../components/shared/InfiniteScroll'
import { useSession } from '../../../context/session'
// import UserCard from './__components/CourseCard'
import UserForm from './__components/CourseForm'
import {
  changeStatus,
  deleteUser,
  downloadFile,
  useCourseList,
} from './__shared/api'
import { Course } from './__shared/type'

export default function UserList() {
  const { isMobile, state } = useSession()
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [search, setSearch] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Course | undefined>()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const query = {
    page,
    size,
  }

  const { data: userList, mutate: refetch } = useCourseList(
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
      await deleteUser(selectedItem?.id as string)
      refetch()
    } catch (error) {
      throw error
    }
  }

  const columns = [
    {
      label: 'Title',
      render: (item: Course) => <Typography>{item.title}</Typography>,
    },
    {
      label: 'Description',
      render: (item: Course) => <Typography>{item.description}</Typography>,
    },
    {
      label: 'Level',
      render: (item: Course) => <Typography>{item.level}</Typography>,
    },
    {
      label: 'Publish',
      render: (item: any) => (
        <Typography>{item.published ? 'Active' : 'Not Active'}</Typography>
      ),
    },
    {
      label: 'Download File',
      render: (item: any) => (
        <Button
          onClick={async () => {
            const response = await downloadFile(item?.id as string)
            const url = window.URL.createObjectURL(
              new Blob([response.data], {
                type: response.headers['content-type'],
              })
            )

            const link = document.createElement('a')
            link.href = url

            const contentDisposition = response.headers['content-disposition']
            let fileName = 'course_Download'
            if (contentDisposition) {
              const matches = /filename="([^"]*)"/.exec(contentDisposition)
              if (matches && matches[1]) {
                fileName = matches[1]
              }
            }
            link.setAttribute('download', fileName)

            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            window.URL.revokeObjectURL(url)
          }}
        >
          Download File
        </Button>
      ),
    },
    {
      label: 'Dibuat',
      render: (item: Course) => <Typography>{item.createdBy}</Typography>,
    },
    {
      label: 'Tanggal Dibuat',
      render: (item: Course) => (
        <Typography sx={{ minWidth: 160 }}>
          {dayjs(item.createdAt).format('DD MMM YYYY HH:mm:ss')}
        </Typography>
      ),
    },
  ]

  if (state.isAdmin) {
    columns.push({
      label: 'Action',
      render: (item) => (
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
                  await changeStatus(item?.id as string)
                  refetch()
                }}
              >
                <ListItemIcon>
                  <Edit />
                </ListItemIcon>
                <ListItemText>Publish</ListItemText>
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
    })
  }

  return (
    <>
      <Stack sx={{ flex: 1 }}>
        <Commandbar
          title="Daftar Couse"
          searchProps={{
            onSearch: (newSearch) => setSearch(newSearch),
            placeholder: 'Cari Course...',
          }}
          breadcrumbsProps={{
            items: [
              {
                label: 'Kategori',
              },
            ],
          }}
          rightAddon={
            state.isAdmin && (
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
                    onActivate={() => handleToggleActive(d)}
                  />
                ))} */}
              </Stack>
            </InfiniteScroll>
          ) : (
            <DataTable
              data={userList?.results}
              loading={!userList}
              columns={columns}
              paginationProps={{
                rowsPerPageOptions: [10, 25, 50],
                rowsPerPage: size,
                count: Number(userList?.total || 0),
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
