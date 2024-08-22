'use client'

import { Add, Delete, Edit, Lock, Menu, Replay } from '@mui/icons-material'
import {
  Avatar,
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
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Commandbar from '../../../components/shared/Commandbar'
import DataTable from '../../../components/shared/DataTable'
import { DialogConfirm } from '../../../components/shared/Dialog/DialogConfirm'
import Dropdown from '../../../components/shared/Dropdown'
import InfiniteScroll from '../../../components/shared/InfiniteScroll'
import { ScopeSlug } from '../../../context/auth/__shared/type'
import { useSession } from '../../../context/session'
import ChangePassword from './__components/ChangePassword'
import UserCard from './__components/UserCard'
import UserForm from './__components/UserForm'
import {
  changeStatus,
  deleteUser,
  getUserAvatarUrl,
  useUserList,
} from './__shared/api'
import { User } from './__shared/type'

export default function UserList() {
  const navigate = useNavigate()
  const { isMobile, state } = useSession()
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [search, setSearch] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [selectedItem, setSelectedItem] = useState<User | undefined>()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedScope, setSelectedScope] = useState<ScopeSlug>(
    ScopeSlug.TRAINEE
  )

  const query = {
    page,
    size,
  }

  const { data: userList, mutate: refetch } = useUserList(
    state.profile?.scope,
    selectedScope,
    {
      ...query,
      'name:likeLower': search ? `%${search}%` : undefined,
    }
  )

  async function handleDelete() {
    try {
      await deleteUser(selectedItem?.id as string)
      refetch()
    } catch (error) {
      throw error
    }
  }

  async function handleToggleActive(user: User) {
    try {
      await changeStatus(user?.id as string)
      refetch()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <>
      <Stack sx={{ flex: 1 }}>
        <Commandbar
          title="Daftar Pengguna"
          searchProps={{
            onSearch: (newSearch) => setSearch(newSearch),
            placeholder: 'Cari Nama...',
          }}
          breadcrumbsProps={{
            items: [
              {
                label: 'Kategori',
              },
            ],
          }}
          rightAddon={
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
          }
        />
        <Tabs
          value={selectedScope}
          sx={{ px: isMobile ? 0 : 2 }}
          onChange={(e, newValue) => setSelectedScope(newValue)}
          variant={isMobile ? 'fullWidth' : undefined}
        >
          <Tab value={ScopeSlug.TRAINEE} label="Pelajar" />
          <Tab
            value={ScopeSlug.INSTRUCTOR}
            label="Instruktur"
            sx={!state.isAdmin ? { display: 'none' } : {}}
          />
          <Tab
            value={ScopeSlug.ADMIN}
            label="Admin"
            sx={!state.isAdmin ? { display: 'none' } : {}}
          />
        </Tabs>
        <Box sx={{ flex: 1, px: 2 }}>
          {isMobile ? (
            <InfiniteScroll>
              <Stack sx={{ gap: 1, py: 2 }}>
                {userList?.results.map((d: User) => (
                  <UserCard
                    key={d.id}
                    data={d}
                    onClick={() => {
                      setSelectedItem(d)
                      setShowForm(true)
                    }}
                    onActivate={() => handleToggleActive(d)}
                  />
                ))}
              </Stack>
            </InfiniteScroll>
          ) : (
            <DataTable
              data={userList?.results}
              loading={!userList}
              columns={[
                {
                  label: 'Avatar',
                  render: (item: User) => (
                    <Avatar
                      sx={{ mr: 2 }}
                      src={
                        item.avatar
                          ? getUserAvatarUrl(item.id as string)
                          : undefined
                      }
                    >
                      <Typography textTransform={'capitalize'}>
                        {item.name.charAt(0)}
                      </Typography>
                    </Avatar>
                  ),
                },
                {
                  label: 'Username',
                  render: (item: User) => (
                    <Link
                      onClick={() =>
                        navigate(`/dashboard/user/${item.id}/overview`)
                      }
                    >
                      <Typography color={'blue'}>{item.username}</Typography>
                    </Link>
                  ),
                },
                {
                  label: 'Nama',
                  render: (item: User) => <Typography>{item.name}</Typography>,
                },
                {
                  label: 'Status',
                  render: (item: User) => (
                    <Chip
                      label={item.isActive ? 'Aktif' : 'Inaktif'}
                      onClick={() => handleToggleActive(item)}
                      variant={item.isActive ? 'filled' : 'outlined'}
                      size="small"
                      color={item.isActive ? 'success' : 'default'}
                      sx={{ width: '100%', maxWidth: 96 }}
                    />
                  ),
                },
                {
                  label: 'Dibuat',
                  render: (item: User) => (
                    <Typography>{item.createdBy}</Typography>
                  ),
                },
                {
                  label: 'Tanggal Dibuat',
                  render: (item: User) => (
                    <Typography sx={{ minWidth: 160 }}>
                      {dayjs(item.createdAt).format('DD MMM YYYY HH:mm:ss')}
                    </Typography>
                  ),
                },
                {
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
                            onClick={() => {
                              setSelectedItem(item)
                              setShowChangePassword(true)
                            }}
                          >
                            <ListItemIcon>
                              <Lock />
                            </ListItemIcon>
                            <ListItemText>Ubah Password</ListItemText>
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
        scope={selectedScope}
      />
      <DialogConfirm
        open={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setSelectedItem(undefined)
        }}
        title="Delete"
        content={`Yakin menghapus akun dengan email ${selectedItem?.email}?`}
        onSubmit={handleDelete}
      />
      <ChangePassword
        isOpen={showChangePassword}
        user={selectedItem}
        onClose={() => {
          setShowChangePassword(false)
          setSelectedItem(undefined)
        }}
      />
    </>
  )
}
