/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import {
  Add,
  Delete,
  Edit,
  Menu,
  Replay
} from '@mui/icons-material'
import {
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Typography
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
// import UserCard from './__components/LessonCard'
import { useNavigate } from 'react-router-dom'
import LessonForm from './__components/CategoryForm'
import { deleteCategory, useCategoryList } from './__shared/api'
import { Category } from './__shared/type'

type LessonListProps = {
  asPage?: boolean
}

export default function CategoryList({ asPage = true }: LessonListProps) {
  const navigate = useNavigate()
  const { isMobile, state } = useSession()
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [search, setSearch] = useState<string>('')
  const [category, setCategory] = useState<any>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Category | undefined>()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showFile, setShowFile] = useState(false)

  const query = {
    page,
    size,
  }

  const { data: CategoryList, mutate: refetch } = useCategoryList({
    ...query,
    'name:likeLower': search ? `%${search}%` : undefined,
  })

  function handleOpenLesson(d: Category) {
    setSelectedItem(d)
    setShowFile(true)
  }



  useEffect(() => {
    refetch()

  }, [])
  async function handleDelete() {
    try {
      await deleteCategory(selectedItem?.id as string)
      refetch()
    } catch (error) {
      throw error
    }
  }

  const columns = [

    {
      label: 'Name',
      render: (item: Category) => (
        <Typography fontSize={12} sx={{ mt: 0.5 }} color="textSecondary">
          {item.name}
        </Typography>
      ),
    },
    {
      label: 'Tanggal Dibuat',
      render: (item: Category) => (
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
              {/* <MenuItem
                onClick={async () => {
                  navigate(`/dashboard/lesson/${item?.id}/overview`)
                }}
              >
                <ListItemIcon>
                  <Details />
                </ListItemIcon>
                <ListItemText>Detail</ListItemText>
              </MenuItem> */}
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

  const renderContent = (
    <DataTable
      fit={asPage}
      data={CategoryList?.results}
      loading={!CategoryList}
      columns={columns}
      paginationProps={{
        rowsPerPageOptions: [10, 25, 50],
        rowsPerPage: size,
        count: Number(CategoryList?.total || 0),
        page,
        onPageChange: (e, value) => setPage(value + 1),
        onRowsPerPageChange: (e) => {
          setSize(Number(e.target.value))
          setPage(1)
        },
      }}
    />
  )

  return (
    <>
      {asPage ? (
        <Stack sx={{ flex: 1 }}>
          <Commandbar
            title="Daftar Category"
            searchProps={{
              onSearch: (newSearch) => {
                if (!newSearch) setSearch('') // Jika input kosong
                else setSearch(newSearch)     // Jika input ada
                setPage(1)
              },
              // onSearch: (newSearch) => {
              //   setSearch(newSearch) // Update search keyword
              //   setPage(1) // Reset page to 1
              // },
              placeholder: 'Cari Materi...',
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
                  {state.isAdmin &&
                    (isMobile ? (
                      <IconButton
                        onClick={() => setShowForm(true)}
                        color="primary"
                      >
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
                    ))}
                </>
              )
            }
          />
          <Box sx={{ flex: 1, px: 2 }}>
            {isMobile ? (
              <InfiniteScroll>
                <Stack sx={{ gap: 1, py: 2 }}>
                  {/* {LessonList?.results.map((d: Lesson) => (
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
              renderContent
            )}
          </Box>
        </Stack>
      ) : (
        renderContent
      )}
      <LessonForm
        isOpen={showForm}
        category={category}
        initialData={selectedItem}
        onClose={() => {
          setShowForm(false)
          setTimeout(() => setSelectedItem(undefined), 500)
        }}
        onSuccess={() => {
          refetch()
          setPage(1)
          setSearch("")
        }}

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
    </>
  )
}
