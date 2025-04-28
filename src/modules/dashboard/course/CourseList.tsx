/* eslint-disable @typescript-eslint/no-unused-vars */
// BankSoalList.jsx
'use client'

import { Add, Details, Menu, Replay } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Commandbar from '../../../components/shared/Commandbar'
import DataTable from '../../../components/shared/DataTable'
import { DialogConfirm } from '../../../components/shared/Dialog/DialogConfirm'
import Dropdown from '../../../components/shared/Dropdown'
import { useSession } from '../../../context/session'
import {
  createCours,
  getJurusan,
  getKelas,
  getMapel,
  getMapMapel,
  useCourseList,
} from './__shared/api'

export default function BankSoalList() {
  const navigate = useNavigate()
  const { isMobile, state } = useSession()
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [search, setSearch] = useState('')
  const [showFormCreate, setShowFormCreate] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(undefined)
  const [mataPelajaranOptions, setMataPelajaranOptions] = useState<any>([])

  const [kelasOptions, setKelasOptions] = useState<any>([])
  const [jurusanOptions, setJurusanOptions] = useState<any>([])
  // Form states
  const [formData, setFormData] = useState({
    mataPelajaran: '',
    kelas: '',
    jurusan: '',
    guru: '',
    semester: '',
    tanggalUjian: '',
    jamUjian: '',
    durasiUjian: '',
    soal: [
      {
        pertanyaan: '',
        jawaban: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: true },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      },
    ],
  })

  const guruOptions = ['Bu Iulu', 'Pak Budi', 'Bu Siti', 'Pak Agus']
  const semesterOptions = ['1', '2', '3', '4', '5', '6']
  const durasiOptions = [
    '30 menit',
    '45 menit',
    '60 menit',
    '90 menit',
    '120 menit',
  ]
  const { data: courseList, mutate: refetch } = useCourseList({
    page: 1,
    size: 50,
    teacherId: state.profile?.kode,
    // order: 'asc',
    // orderBy: 'level',
    // 'published:eq': true,
  })
  console.log(courseList)

  // Mock data for the table
  const [bankSoalList, setBankSoalList] = useState<any>([])
  const GetMatapelajara = async () => {
    try {
      const res = await getMapel({ kodeMapel: state.profile?.skdmapel })
      // console.log(res)
      setMataPelajaranOptions(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  const GetMapmataapelajara = async (e: any) => {
    try {
      const res = await getMapMapel({
        kodeMapel: state.profile?.skdmapel,
        semester: e,
      })
      if (res.data) {
        const kodeKelasList = res.data.map((item: any) => item.kodeKelas)
        const kodeKelasQuery = kodeKelasList.join(',')
        const resKelass = await getKelas({ kodeKelas: kodeKelasQuery })
        setKelasOptions(resKelass.data)
      }
      // setMataPelajaranOptions(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const GetJurusanKelas = async (jrusanId: any) => {
    try {
      const res = await getJurusan({ kelasId: jrusanId })
      // console.log(res)
      setJurusanOptions(res.data)
      // setMataPelajaranOptions(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    GetMatapelajara()
    // GetMapmataapelajara()
  }, [])

  // Add new question to form
  const addQuestion = () => {
    const newSoal = [...formData.soal]
    newSoal.push({
      pertanyaan: 'Jawab pertanyaan dibawah ini dengan benar',
      jawaban: [
        { text: 'Jawaban A benar', isCorrect: false },
        { text: 'Jawaban B benar', isCorrect: true },
        { text: 'Jawaban C benar', isCorrect: false },
        { text: 'Jawaban D benar', isCorrect: false },
      ],
    })
    setFormData({ ...formData, soal: newSoal })
  }

  // Handle form change
  const handleFormChange = (field: any, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  // Handle question change
  const handleQuestionChange = (index: any, value: any) => {
    const newSoal = [...formData.soal]
    newSoal[index].pertanyaan = value
    setFormData({ ...formData, soal: newSoal })
  }

  // Handle answer change
  const handleAnswerChange = (
    questionIndex: any,
    answerIndex: any,
    value: any
  ) => {
    const newSoal = [...formData.soal]
    newSoal[questionIndex].jawaban[answerIndex].text = value
    setFormData({ ...formData, soal: newSoal })
  }

  // Handle correct answer change
  const handleCorrectAnswerChange = (questionIndex: any, answerIndex: any) => {
    const newSoal = [...formData.soal]
    newSoal[questionIndex].jawaban.forEach((answer, idx) => {
      answer.isCorrect = idx === answerIndex
    })
    setFormData({ ...formData, soal: newSoal })
  }

  // Handle form submit
  const handleSubmit = async () => {
    try {
      const payload = {
        mataPelajaranId: formData.mataPelajaran,
        kelasId: formData.kelas,
        jurusanId: formData.jurusan,
        semester: formData.semester,
        tanggalUjian: formData.tanggalUjian,
        jamUjian: formData.jamUjian,
        durasiUjian: parseInt(formData.durasiUjian),
        guruId: state.profile?.kode,
        soal: formData.soal,
      }

      await createCours(payload)
      toast.success('Soal ujian berhasil disimpan')
      setShowFormCreate(false)

      // Reset form
      setFormData({
        mataPelajaran: '',
        kelas: '',
        jurusan: '',
        guru: '',
        semester: '',
        tanggalUjian: '',
        durasiUjian: '',
        jamUjian: '',
        soal: [
          {
            pertanyaan: 'Jawab pertanyaan dibawah ini dengan benar',
            jawaban: [
              { text: 'Jawaban A benar', isCorrect: false },
              { text: 'Jawaban B benar', isCorrect: true },
              { text: 'Jawaban C benar', isCorrect: false },
              { text: 'Jawaban D benar', isCorrect: false },
            ],
          },
        ],
      })
      refetch()
    } catch (error) {
      console.log(error)

      // toast.error(error)
    }
  }

  // Handle delete
  const handleDelete = () => {
    // Filter out the deleted item
    const newList = bankSoalList.results.filter(
      (item: any) => item.id !== selectedItem?.id
    )
    setBankSoalList({
      results: newList,
      total: bankSoalList.total - 1,
    })
    setShowDeleteConfirm(false)
    setSelectedItem(undefined)
    toast.success('Soal ujian berhasil dihapus')
  }

  // Fetch data when filters change
  useEffect(() => {
    // In a real app, you would fetch data based on filters
    console.log('Fetching data...')
  }, [page, size, search])

  const columns = [
    {
      label: 'Mata Pelajaran',
      render: (item: any) => <Typography>{item.subject.nama}</Typography>,
    },
    {
      label: 'Kelas',
      render: (item: any) => <Typography>{item.classroom.nama}</Typography>,
    },
    {
      label: 'Jurusan',
      render: (item: any) => (
        <Typography>{item.classroom.jurusans.nama}</Typography>
      ),
    },
    {
      label: 'Nama Guru',
      render: (item: any) => <Typography>{item.teacher.nama}</Typography>,
    },
    {
      label: 'Tanggal Ujian',
      render: (item: any) => (
        <Typography>
          {item.scheduledAt
            ? new Date(item.scheduledAt).toLocaleDateString()
            : '-'}
        </Typography>
      ),
    },
    {
      label: 'Aksi',
      render: (item: any) => (
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
                  navigate(`/dashboard/course/${item?.id}`)
                }}
              >
                <ListItemIcon>
                  <Details />
                </ListItemIcon>
                <ListItemText>Detail</ListItemText>
              </MenuItem>
              {/* <MenuItem
                onClick={() => {
                  setSelectedItem(item)
                  setShowDeleteConfirm(true)
                }}
              >
                <ListItemIcon>
                  <Delete />
                </ListItemIcon>
                <ListItemText>Hapus</ListItemText>
              </MenuItem> */}
            </>
          }
        />
      ),
    },
  ]

  return (
    <>
      <Stack sx={{ flex: 1 }}>
        <Commandbar
          title="Menu Bank Soal"
          searchProps={{
            onSearch: (newSearch) => setSearch(newSearch),
            placeholder: 'Pencarian...',
          }}
          rightAddon={
            <>
              <IconButton onClick={() => {}} sx={{ mr: isMobile ? 0 : 2 }}>
                <Replay />
              </IconButton>
              {state.isInstructor &&
                (isMobile ? (
                  <IconButton
                    onClick={() => setShowFormCreate(true)}
                    color="primary"
                  >
                    <Add />
                  </IconButton>
                ) : (
                  <Button
                    startIcon={<Add />}
                    variant="contained"
                    color="primary"
                    onClick={() => setShowFormCreate(true)}
                  >
                    Buat Soal
                  </Button>
                ))}
            </>
          }
        />

        <Box sx={{ flex: 1, px: 2 }}>
          <Box sx={{ my: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              MENU BANK SOAL
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Menu bank soal berisi informasi terkait dengan daftar soal ujian
              yang sudah dibuat oleh guru dan menu untuk membuat soal ujian.
            </Typography>
          </Box>

          <DataTable
            data={courseList?.results}
            loading={!courseList}
            columns={columns}
            paginationProps={{
              rowsPerPageOptions: [10, 25, 50],
              rowsPerPage: size,
              count: Number(courseList?.total || 0),
              page,
              onPageChange: (e, value) => setPage(value + 1),
              onRowsPerPageChange: (e) => {
                setSize(Number(e.target.value))
                setPage(1)
              },
            }}
          />
        </Box>
      </Stack>

      {/* Form untuk membuat soal */}
      <Dialog
        open={showFormCreate}
        onClose={() => setShowFormCreate(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Buat Soal Ujian</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Pilih mata pelajaran</InputLabel>
                <Select
                  value={formData.mataPelajaran}
                  onChange={(e) =>
                    handleFormChange('mataPelajaran', e.target.value)
                  }
                  label="Pilih mata pelajaran"
                >
                  {mataPelajaranOptions.map((option: any) => (
                    <MenuItem key={option.kode} value={option.kode}>
                      {option.nama}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Semester</InputLabel>
                <Select
                  value={formData.semester}
                  onChange={(e) => {
                    handleFormChange('semester', e.target.value)
                    GetMapmataapelajara(e.target.value)
                  }}
                  label="Semester"
                >
                  {semesterOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              {formData.semester && (
                <FormControl fullWidth size="small">
                  <InputLabel>Pilih kelas</InputLabel>
                  <Select
                    value={formData.kelas}
                    onChange={(e) => {
                      const selectedKode = e.target.value
                      const selectedOption = kelasOptions.find(
                        (option: any) => option.kode === selectedKode
                      )
                      console.log(selectedOption)

                      if (selectedOption) {
                        handleFormChange('kelas', selectedKode) // simpan kode ke form
                        GetJurusanKelas(selectedOption.kodeKompetensikeahlian) // kirim kode_kompetensikeahlian
                      }
                    }}
                    label="Pilih kelas"
                  >
                    {kelasOptions.map((option: any) => (
                      <MenuItem key={option.kode} value={option.kode}>
                        {option.nama}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              {formData.kelas && (
                <FormControl fullWidth size="small">
                  <InputLabel>Pilih jurusan</InputLabel>
                  <Select
                    value={formData.jurusan}
                    onChange={(e) =>
                      handleFormChange('jurusan', e.target.value)
                    }
                    label="Pilih jurusan"
                  >
                    {jurusanOptions.map((option: any) => (
                      <MenuItem key={option.kode} value={option.kode}>
                        {option.nama}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Grid>

            {/* <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Soal</InputLabel>
                <Select
                  value={formData.soalType || 'Soal A'}
                  onChange={(e) => handleFormChange('soalType', e.target.value)}
                  label="Soal"
                >
                  {soalOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tanggal ujian"
                type="date"
                size="small"
                value={formData.tanggalUjian}
                onChange={(e) =>
                  handleFormChange('tanggalUjian', e.target.value)
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Jam ujian"
                type="time"
                size="small"
                value={formData.jamUjian}
                onChange={(e) => handleFormChange('jamUjian', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Durasi ujian</InputLabel>
                <Select
                  value={formData.durasiUjian}
                  onChange={(e) =>
                    handleFormChange('durasiUjian', e.target.value)
                  }
                  label="Durasi ujian"
                >
                  {durasiOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={addQuestion}
                fullWidth
                sx={{ height: '40px' }}
              >
                Tambah soal
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {formData.soal.map((soal, soalIndex) => (
            <Box
              key={soalIndex}
              sx={{ mb: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {soalIndex + 1}. Jawab pertanyaan dibawah ini dengan benar
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                value={soal.pertanyaan}
                onChange={(e) =>
                  handleQuestionChange(soalIndex, e.target.value)
                }
                sx={{ mb: 2 }}
              />

              <RadioGroup
                value={soal.jawaban.findIndex((ans) => ans.isCorrect)}
                onChange={(e) =>
                  handleCorrectAnswerChange(soalIndex, parseInt(e.target.value))
                }
              >
                {soal.jawaban.map((jawaban, jawabanIndex) => (
                  <Box
                    key={jawabanIndex}
                    sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                  >
                    <FormControlLabel
                      value={jawabanIndex}
                      control={<Radio />}
                      label={`${String.fromCharCode(65 + jawabanIndex)}.`}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      value={jawaban.text}
                      onChange={(e) =>
                        handleAnswerChange(
                          soalIndex,
                          jawabanIndex,
                          e.target.value
                        )
                      }
                    />
                  </Box>
                ))}
              </RadioGroup>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFormCreate(false)}>Batalkan</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Simpan soal ujian
          </Button>
        </DialogActions>
      </Dialog>

      <DialogConfirm
        open={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setSelectedItem(undefined)
        }}
        title="Hapus Soal"
        content={`Yakin menghapus soal ujian ini?`}
        onSubmit={handleDelete}
      />
    </>
  )
}
