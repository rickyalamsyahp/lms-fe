/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import {
  Add,
  ArrowUpward,
  Delete,
  Details,
  Edit,
  Menu,
  Replay,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
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
import { useEffect, useState } from 'react'
// import toast from 'react-hot-toast'
import Commandbar from '../../../components/shared/Commandbar'
import DataTable from '../../../components/shared/DataTable'
import { DialogConfirm } from '../../../components/shared/Dialog/DialogConfirm'
import Dropdown from '../../../components/shared/Dropdown'
import InfiniteScroll from '../../../components/shared/InfiniteScroll'
import { useSession } from '../../../context/session'
// import UserCard from './__components/CourseCard'
import { useNavigate } from 'react-router-dom'
import FileViewer from '../../filemeta/__components/FileViewer'
import UserForm from './__components/CourseForm'
import { changeStatus, deleteUser, useCourseList } from './__shared/api'
import { Course } from './__shared/type'

export default function UserList() {
  const navigate = useNavigate()
  const { isMobile, state } = useSession()
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [search, setSearch] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Course | undefined>()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showFile, setShowFile] = useState(false)

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

  function handleOpenCourse(d: Course) {
    setSelectedItem(d)
    setShowFile(true)
  }

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
      render: (item: Course) =>
        item.fileMeta ? (
          <Link
            sx={{ cursor: 'pointer' }}
            onClick={() => handleOpenCourse(item)}
          >
            <Typography>{item.title}</Typography>
          </Link>
        ) : (
          <Typography>{item.title}</Typography>
        ),
    },
    {
      label: 'Description',
      render: (item: Course) => (
        <Typography fontSize={12} sx={{ mt: 0.5 }} color="textSecondary">
          {item.description}
        </Typography>
      ),
    },
    {
      label: 'Level',
      render: (item: Course) => <Typography>{item.level}</Typography>,
    },
    {
      label: 'Status',
      render: (item: any) => (
        <Chip
          size="small"
          label={item.published ? 'Published' : 'Unpublished'}
          color={item?.published ? 'success' : 'default'}
        />
      ),
    },

    // {
    //   label: 'Dibuat',
    //   render: (item: Course) => <Typography>{item.createdBy}</Typography>,
    // },
    {
      label: 'Tanggal Dibuat',
      render: (item: Course) => (
        <Typography sx={{ minWidth: 160 }}>
          {dayjs(item.createdAt).format('DD MMM YYYY HH:mm:ss')}
        </Typography>
      ),
    },
  ]

  if (state.isAdmin || state.isInstructor) {
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
                onClick={async () => {
                  navigate(`/dashboard/course/${item?.id}/overview`)
                }}
              >
                <ListItemIcon>
                  <Details />
                </ListItemIcon>
                <ListItemText>Detail</ListItemText>
              </MenuItem>
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
                  <ArrowUpward />
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
          title="Daftar Pembelajaran"
          searchProps={{
            onSearch: (newSearch) => setSearch(newSearch),
            placeholder: 'Cari Pembelajaran...',
          }}
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
        content={`Yakin menghapus modul pembelajaran ini?`}
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
