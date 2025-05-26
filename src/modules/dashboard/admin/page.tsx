import {
  Add,
  AdminPanelSettings,
  Delete,
  Download,
  Edit,
  Person,
  School,
  Upload,
  Visibility,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import Commandbar from '../../../components/shared/Commandbar'
import DataTable from '../../../components/shared/DataTable'
import { DialogConfirm } from '../../../components/shared/Dialog/DialogConfirm'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(25)
  const [search, setSearch] = useState('')
  const [userType, setUserType] = useState('')
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)

  const [userForm, setUserForm] = useState({
    name: '',
    username: '',
    email: '',
    role: 'student',
    kodeKelas: '',
    nip: '',
    nis: '',
    password: '',
    isActive: true,
  })

  useEffect(() => {
    fetchUsers()
  }, [page, size, search, userType])

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        search,
        userType,
      })

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()
      setUsers(data.data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const handleSaveUser = async () => {
    try {
      const url = isEditing
        ? `/api/admin/users/${selectedUser.id}`
        : '/api/admin/users'
      const method = isEditing ? 'PUT' : 'POST'

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm),
      })

      setShowUserDialog(false)
      resetForm()
      fetchUsers()
    } catch (error) {
      console.error('Failed to save user:', error)
    }
  }

  const handleDeleteUser = async () => {
    try {
      await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
      })

      setShowDeleteConfirm(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const handleResetPassword = async () => {
    try {
      await fetch(`/api/admin/users/${selectedUser.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: userForm.password }),
      })

      setShowPasswordDialog(false)
      setSelectedUser(null)
      resetForm()
    } catch (error) {
      console.error('Failed to reset password:', error)
    }
  }

  const resetForm = () => {
    setUserForm({
      name: '',
      username: '',
      email: '',
      role: 'student',
      kodeKelas: '',
      nip: '',
      nis: '',
      password: '',
      isActive: true,
    })
    setIsEditing(false)
    setSelectedUser(null)
  }

  const downloadUsersTemplate = () => {
    const link = document.createElement('a')
    link.href = '/templates/users-template.xlsx'
    link.download = 'template-user.xlsx'
    link.click()
  }

  const downloadUsersData = async () => {
    try {
      const response = await fetch('/api/admin/users/download')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `users-data-${new Date().toISOString().split('T')[0]}.xlsx`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download users:', error)
    }
  }

  const handleBulkImport = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      await fetch('/api/admin/users/import', {
        method: 'POST',
        body: formData,
      })

      fetchUsers()
    } catch (error) {
      console.error('Failed to import users:', error)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <AdminPanelSettings />
      case 'teacher':
        return <School />
      case 'student':
        return <Person />
      default:
        return <Person />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error' as const
      case 'teacher':
        return 'primary' as const
      case 'student':
        return 'default' as const
      default:
        return 'default' as const
    }
  }

  const columns = [
    {
      label: 'User',
      render: (item: any) => (
        <Box>
          <Typography fontWeight="bold">{item.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {item.username}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item.email}
          </Typography>
        </Box>
      ),
    },
    {
      label: 'Role',
      render: (item: any) => (
        <Chip
          icon={getRoleIcon(item.role)}
          label={item.role.toUpperCase()}
          color={getRoleColor(item.role)}
          size="small"
        />
      ),
    },
    {
      label: 'ID',
      render: (item: any) => (
        <Typography variant="body2" fontFamily="monospace">
          {item.nis || item.nip || '-'}
        </Typography>
      ),
    },
    {
      label: 'Kelas',
      render: (item: any) => (
        <Typography variant="body2">{item.kodeKelas || '-'}</Typography>
      ),
    },
    {
      label: 'Status',
      render: (item: any) => (
        <Chip
          label={item.isActive ? 'Aktif' : 'Nonaktif'}
          color={item.isActive ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      label: 'Last Login',
      render: (item: any) => (
        <Typography variant="body2">
          {item.lastLogin
            ? new Date(item.lastLogin).toLocaleString('id-ID')
            : 'Belum pernah'}
        </Typography>
      ),
    },
    {
      label: 'Aksi',
      render: (item: any) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={() => {
              setSelectedUser(item)
              setUserForm({ ...item })
              setIsEditing(true)
              setShowUserDialog(true)
            }}
          >
            <Edit />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => {
              setSelectedUser(item)
              setShowPasswordDialog(true)
            }}
          >
            <Visibility />
          </IconButton>

          <IconButton
            size="small"
            color="error"
            onClick={() => {
              setSelectedUser(item)
              setShowDeleteConfirm(true)
            }}
          >
            <Delete />
          </IconButton>
        </Stack>
      ),
    },
  ]

  return (
    <>
      <Commandbar
        title="Manajemen User"
        searchProps={{
          onSearch: setSearch,
          placeholder: 'Cari user...',
        }}
        rightAddon={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={downloadUsersTemplate}
              size="small"
            >
              Template
            </Button>

            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={downloadUsersData}
              size="small"
            >
              Export
            </Button>

            <Button
              variant="outlined"
              startIcon={<Upload />}
              component="label"
              size="small"
            >
              Import
              <input
                hidden
                accept=".xlsx,.xls"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleBulkImport(file)
                }}
              />
            </Button>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                resetForm()
                setShowUserDialog(true)
              }}
            >
              Tambah User
            </Button>
          </Stack>
        }
      />

      <Box sx={{ p: 3 }}>
        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={2}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  label="Role"
                >
                  <MenuItem value="">Semua</MenuItem>
                  <MenuItem value="student">Siswa</MenuItem>
                  <MenuItem value="teacher">Guru</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>

        {/* Users Table */}
        <DataTable
          data={users}
          loading={!users}
          columns={columns}
          paginationProps={{
            rowsPerPageOptions: [10, 25, 50],
            rowsPerPage: size,
            count: users.length,
            page,
            onPageChange: (e, value) => setPage(value + 1),
            onRowsPerPageChange: (e) => {
              setSize(Number(e.target.value))
              setPage(1)
            },
          }}
        />
      </Box>

      {/* User Dialog */}
      <Dialog
        open={showUserDialog}
        onClose={() => setShowUserDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? 'Edit User' : 'Tambah User Baru'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nama Lengkap"
                value={userForm.name}
                onChange={(e) =>
                  setUserForm({ ...userForm, name: e.target.value })
                }
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                value={userForm.username}
                onChange={(e) =>
                  setUserForm({ ...userForm, username: e.target.value })
                }
                required
                disabled={isEditing}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={userForm.role}
                  onChange={(e) =>
                    setUserForm({ ...userForm, role: e.target.value })
                  }
                  label="Role"
                >
                  <MenuItem value="student">Siswa</MenuItem>
                  <MenuItem value="teacher">Guru</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={userForm.email}
                onChange={(e) =>
                  setUserForm({ ...userForm, email: e.target.value })
                }
              />
            </Grid>

            {userForm.role === 'student' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="NIS"
                    value={userForm.nis}
                    onChange={(e) =>
                      setUserForm({ ...userForm, nis: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Kode Kelas"
                    value={userForm.kodeKelas}
                    onChange={(e) =>
                      setUserForm({ ...userForm, kodeKelas: e.target.value })
                    }
                  />
                </Grid>
              </>
            )}

            {userForm.role === 'teacher' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="NIP"
                  value={userForm.nip}
                  onChange={(e) =>
                    setUserForm({ ...userForm, nip: e.target.value })
                  }
                />
              </Grid>
            )}

            {!isEditing && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={userForm.password}
                  onChange={(e) =>
                    setUserForm({ ...userForm, password: e.target.value })
                  }
                  required
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={userForm.isActive}
                    onChange={(e) =>
                      setUserForm({ ...userForm, isActive: e.target.checked })
                    }
                  />
                }
                label="User Aktif"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUserDialog(false)}>Batal</Button>
          <Button onClick={handleSaveUser} variant="contained">
            {isEditing ? 'Update' : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Dialog */}
      <Dialog
        open={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Reset password untuk user: <strong>{selectedUser?.name}</strong>
          </Typography>
          <TextField
            fullWidth
            label="Password Baru"
            type="password"
            value={userForm.password}
            onChange={(e) =>
              setUserForm({ ...userForm, password: e.target.value })
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Batal</Button>
          <Button
            onClick={handleResetPassword}
            variant="contained"
            color="warning"
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <DialogConfirm
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Hapus User"
        content={`Yakin menghapus user "${selectedUser?.name}"?`}
        onSubmit={handleDeleteUser}
      />
    </>
  )
}
