/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import {
  Add,
  ArrowUpward,
  Delete,
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
  Tab,
  Tabs,
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
// import UserCard from './__components/LessonCard'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import FileViewer from '../../filemeta/__components/FileViewer'
import { useCategoryList } from '../category/__shared/api'
import UserById from '../user/__components/UserById'
import LessonForm from './__components/LessonForm'
import { deleteLesson, getCategory, togglePublish, useLessonList } from './__shared/api'
import { Lesson } from './__shared/type'

type LessonListProps = {
  asPage?: boolean
}

export default function LessonList({ asPage = true }: LessonListProps) {
  const navigate = useNavigate()
  const { isMobile, state } = useSession()
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [search, setSearch] = useState<string>('')
  const [category, setCategory] = useState<any>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Lesson | undefined>()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showFile, setShowFile] = useState(false)
  const [tabValue, setTabValue] = useState('all')
  const query = {
    page,
    size,
  }

  const { data: LessonList, mutate: refetch } = useLessonList({
    ...query,
    'title:likeLower': search ? `%${search}%` : undefined,
    'category:eq': tabValue !== 'all'? `${tabValue}` : undefined,
  })
 const { data: CategoryList, mutate: refetch2 } = useCategoryList({
    undefined})

    
  function handleOpenLesson(d: Lesson) {
    setSelectedItem(d)
    setShowFile(true)
  }

  async function handleTogglePublish(lesson: Lesson) {
    try {
      await togglePublish(lesson?.id as string)
      refetch()
    } catch (error: any) {
      toast.error(error.message)
    }
  }
  async function getCategorys() {
    try {
      const res = await getCategory()
      setCategory(res.data.results)
    } catch (error) {
      console.error(error);

    }
  }
  useEffect(() => {
    refetch()
    getCategorys()
  }, [])
  async function handleDelete() {
    try {
      await deleteLesson(selectedItem?.id as string)
      refetch()
    } catch (error) {
      throw error
    }
  }

  const columns = [
    {
      label: 'Title',
      render: (item: Lesson) =>
        item.fileMeta ? (
          <Link
            sx={{ cursor: 'pointer' }}
            onClick={() => handleOpenLesson(item)}
          >
            <Typography>{item.title}</Typography>
          </Link>
        ) : (
          <Typography>{item.title}</Typography>
        ),
    },
    {
      label: 'Description',
      render: (item: Lesson) => (
        <Typography fontSize={12} sx={{ mt: 0.5 }} color="textSecondary">
          {item.description}
        </Typography>
      ),
    },
    {
      label: 'Kategori',
      render: (item: Lesson) => (
        <Typography fontSize={12} sx={{ mt: 0.5 }} color="textSecondary">
          {item.category}
        </Typography>
      ),
    },
    {
      label: 'Status',
      render: (item: Lesson) => (
        <Chip
          size="small"
          label={item.published ? 'Published' : 'Unpublished'}
          color={item?.published ? 'success' : 'default'}
          onClick={state.isAdmin ? () => handleTogglePublish(item) : undefined}
          sx={state.isAdmin ? { cursor: 'pointer' } : undefined}
        />
      ),
    },

    {
      label: 'Dibuat',
      render: (item: Lesson) => <UserById id={item.createdBy as string} />,
    },
    {
      label: 'Tanggal Dibuat',
      render: (item: Lesson) => (
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
              {state.isAdmin && (
                <MenuItem
                  onClick={async () => {
                    await togglePublish(item?.id as string)
                    refetch()
                  }}
                >
                  <ListItemIcon>
                    <ArrowUpward />
                  </ListItemIcon>
                  <ListItemText>Publish</ListItemText>
                </MenuItem>
              )}
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
      data={LessonList?.results}
      loading={!LessonList}
      columns={columns}
      paginationProps={{
        rowsPerPageOptions: [10, 25, 50],
        rowsPerPage: size,
        count: Number(LessonList?.total || 0),
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
            title="Daftar Materi"
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
               <Tabs
          value={tabValue}
          sx={{ px: isMobile ? 0 : 2 }}
          onChange={(e, newValue) =>{ 
            setTabValue(newValue)
            setPage(1)
          }}
          variant={isMobile ? 'fullWidth' : undefined}
        >
            <Tab value={'all'} label="All Kategori" />
          {CategoryList?.results.map((a, b) =>(
              <Tab key={b} value={a.name} label={a.name} />
          ))}
         
        </Tabs>
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
