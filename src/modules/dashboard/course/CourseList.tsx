/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Add,
  AudioFile,
  Delete,
  Details,
  Download,
  Drafts,
  Image,
  Menu,
  People,
  Replay,
  Save,
  Upload,
  Visibility,
} from '@mui/icons-material'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
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
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { MathJax, MathJaxContext } from 'better-react-mathjax'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Commandbar from '../../../components/shared/Commandbar'
import DataTable from '../../../components/shared/DataTable'
import { DialogConfirm } from '../../../components/shared/Dialog/DialogConfirm'
import Dropdown from '../../../components/shared/Dropdown'
import { useSession } from '../../../context/session'
import AttendanceDialog from './__components/AttendanceDialog'
import OnlineStudentsDialog from './__components/OnlineStudentsDialog'
import {
  createCours,
  getJurusan,
  getKelas,
  getMapel,
  getMapMapel,
  useCourseList,
} from './__shared/api'

// Question Types
enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  COMPLEX_MULTIPLE_CHOICE = 'complex_multiple_choice',
  TRUE_FALSE = 'true_false',
  ESSAY = 'essay',
}

const questionTypeLabels = {
  [QuestionType.MULTIPLE_CHOICE]: 'Pilihan Ganda',
  [QuestionType.COMPLEX_MULTIPLE_CHOICE]: 'Pilihan Ganda Kompleks',
  [QuestionType.TRUE_FALSE]: 'Benar/Salah',
  [QuestionType.ESSAY]: 'Essay',
}

export default function EnhancedBankSoalList() {
  const navigate = useNavigate()
  const { isMobile, state } = useSession()
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [search, setSearch] = useState('')
  const [showFormCreate, setShowFormCreate] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showReopenDialog, setShowReopenDialog] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false)
  const [showOnlineStudents, setShowOnlineStudents] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(undefined)
  const [activeTab, setActiveTab] = useState(0)
  const [isDraft, setIsDraft] = useState(true)
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(
    null
  )
  const [mataPelajaranOptions, setMataPelajaranOptions] = useState<any>([])
  const [kelasOptions, setKelasOptions] = useState<any>([])
  const [jurusansOptions, setJurusanOptions] = useState<any>([])
  const semesterOptions = ['1', '2', '3', '4', '5', '6']

  const { data: courseList, mutate: refetch } = useCourseList({
    page: 1,
    size: 50,
    teacherId: state.profile?.kode,
    // order: 'asc',
    // orderBy: 'level',
    // 'published:eq': true,
  })

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
  // Enhanced form data
  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    mataPelajaran: '',
    jurusan: '',
    classroomIds: [], // Multiple classes
    coTeacherIds: [], // Co-teachers
    semester: '',
    tanggalUjian: '',
    jamUjian: '',
    durasiUjian: '',
    randomizeQuestions: false,
    randomizeAnswers: false,
    requireAllAnswers: true,
    showResults: true,
    allowReview: false,
    instructions: '',
    passingScore: '',
    soal: [],
  })

  // Auto-save functionality
  // const autoSave = useCallback(async () => {
  //   if (formData.soal.length > 0) {
  //     try {
  //       await saveAsDraft(formData)
  //       console.log('Auto-saved at', new Date().toLocaleTimeString())
  //     } catch (error) {
  //       console.error('Auto-save failed:', error)
  //     }
  //   }
  // }, [formData])

  // useEffect(() => {
  //   if (showFormCreate && formData.soal.length > 0) {
  //     if (autoSaveTimer) clearTimeout(autoSaveTimer)
  //     const timer = setTimeout(autoSave, 5000) // Auto-save every 5 seconds
  //     setAutoSaveTimer(timer)
  //   }
  //   return () => {
  //     if (autoSaveTimer) clearTimeout(autoSaveTimer)
  //   }
  // }, [formData, showFormCreate, autoSave])

  // Add new question to form - moved to bottom
  const addQuestion = () => {
    const newSoal = [...formData.soal]
    newSoal.push({
      type: QuestionType.MULTIPLE_CHOICE,
      pertanyaan: '',
      imageUrl: '',
      audioUrl: '',
      equation: '',
      keywords: [],
      points: 1,
      explanation: '',
      jawaban: [
        { text: '', isCorrect: false, imageUrl: '', audioUrl: '' },
        { text: '', isCorrect: true, imageUrl: '', audioUrl: '' },
        { text: '', isCorrect: false, imageUrl: '', audioUrl: '' },
        { text: '', isCorrect: false, imageUrl: '', audioUrl: '' },
        { text: '', isCorrect: false, imageUrl: '', audioUrl: '' },
      ],
    })
    setFormData({ ...formData, soal: newSoal })
  }

  // Remove question
  const removeQuestion = (index: number) => {
    const newSoal = [...formData.soal]
    newSoal.splice(index, 1)
    setFormData({ ...formData, soal: newSoal })
  }

  // Handle question type change
  const handleQuestionTypeChange = (index: number, type: QuestionType) => {
    const newSoal = [...formData.soal]
    newSoal[index].type = type

    // Adjust answers based on type
    if (type === QuestionType.TRUE_FALSE) {
      newSoal[index].jawaban = [
        { text: 'Benar', isCorrect: true, imageUrl: '', audioUrl: '' },
        { text: 'Salah', isCorrect: false, imageUrl: '', audioUrl: '' },
      ]
    } else if (type === QuestionType.ESSAY) {
      newSoal[index].jawaban = []
      newSoal[index].keywords = ['']
    } else if (newSoal[index].jawaban.length < 4) {
      // Ensure minimum 4 options for multiple choice
      while (newSoal[index].jawaban.length < 4) {
        newSoal[index].jawaban.push({
          text: '',
          isCorrect: false,
          imageUrl: '',
          audioUrl: '',
        })
      }
    }

    setFormData({ ...formData, soal: newSoal })
  }

  // Handle complex multiple choice (multiple correct answers)
  const handleComplexAnswerChange = (
    questionIndex: number,
    answerIndex: number,
    isCorrect: boolean
  ) => {
    const newSoal = [...formData.soal]
    newSoal[questionIndex].jawaban[answerIndex].isCorrect = isCorrect
    setFormData({ ...formData, soal: newSoal })
  }

  // Handle file uploads
  const handleImageUpload = async (
    file: File,
    type: 'question' | 'answer',
    questionIndex: number,
    answerIndex?: number
  ) => {
    try {
      const formDatas = new FormData()
      formDatas.append('file', file)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formDatas,
      })

      const result = await response.json()

      if (result.success) {
        const newSoal = [...formData.soal]
        if (type === 'question') {
          newSoal[questionIndex].imageUrl = result.url
        } else if (type === 'answer' && answerIndex !== undefined) {
          newSoal[questionIndex].jawaban[answerIndex].imageUrl = result.url
        }
        setFormData({ ...formData, soal: newSoal })
        toast.success('Gambar berhasil diupload')
      }
    } catch (error) {
      toast.error('Gagal upload gambar')
    }
  }

  const handleAudioUpload = async (
    file: File,
    type: 'question' | 'answer',
    questionIndex: number,
    answerIndex?: number
  ) => {
    try {
      const formDatas = new FormData()
      formDatas.append('file', file)

      const response = await fetch('/api/upload/audio', {
        method: 'POST',
        body: formDatas,
      })

      const result = await response.json()

      if (result.success) {
        const newSoal = [...formData.soal]
        if (type === 'question') {
          newSoal[questionIndex].audioUrl = result.url
        } else if (type === 'answer' && answerIndex !== undefined) {
          newSoal[questionIndex].jawaban[answerIndex].audioUrl = result.url
        }
        setFormData({ ...formData, soal: newSoal })
        toast.success('Audio berhasil diupload')
      }
    } catch (error) {
      toast.error('Gagal upload audio')
    }
  }

  // Save as draft
  // const saveAsDraft = async (data: any) => {
  //   try {
  //     const payload = {
  //       ...data,
  //       status: 'draft',
  //       guruId: state.profile?.kode,
  //     }
  //     await createCours(payload)
  //     toast.success('Draft berhasil disimpan')
  //   } catch (error) {
  //     console.error('Failed to save draft:', error)
  //   }
  // }

  // Handle form submit
  const handleSubmit = async (saveType: 'draft' | 'active' = 'active') => {
    try {
      const payload = {
        ...formData,
        mataPelajaranId: formData.mataPelajaran,
        status: saveType,
        guruId: state.profile?.kode,
        classroomIds: formData.classroomIds,
        coTeacherIds: formData.coTeacherIds,
        passingScore: Number(formData.passingScore),
        durasiUjian: Number(formData.durasiUjian),
      }

      await createCours(payload)
      toast.success(
        `Soal ujian berhasil ${saveType === 'draft' ? 'disimpan sebagai draft' : 'dipublikasi'}`
      )
      setShowFormCreate(false)
      resetForm()
      refetch()
    } catch (error) {
      toast.error('Gagal menyimpan soal ujian')
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      mataPelajaran: '',
      classroomIds: [],
      coTeacherIds: [],
      semester: '',
      tanggalUjian: '',
      jamUjian: '',
      durasiUjian: '',
      randomizeQuestions: false,
      randomizeAnswers: false,
      requireAllAnswers: true,
      showResults: true,
      allowReview: false,
      instructions: '',
      passingScore: '',
      soal: [],
    })
  }

  // Import from Excel
  const handleExcelImport = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/question-bank/import-excel', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Berhasil import ${result.totalQuestions} soal`)
        // refetch()
      }
    } catch (error) {
      toast.error('Gagal import dari Excel')
    }
  }

  // Download Excel template
  const downloadExcelTemplate = () => {
    const link = document.createElement('a')
    link.href = '/templates/question-template.xlsx'
    link.download = 'template-soal-ujian.xlsx'
    link.click()
  }

  // Reopen exam
  const handleReopenExam = async (examId: string, studentIds?: string[]) => {
    try {
      // await reopenExam(examId, studentIds)
      toast.success('Ujian berhasil dibuka kembali')
      setShowReopenDialog(false)
      // refetch()
    } catch (error) {
      toast.error('Gagal membuka kembali ujian')
    }
  }

  // Download participants
  const handleDownloadParticipants = async (examId: string) => {
    try {
      const response = await fetch(`/api/question-bank/${examId}/participants`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `participants_${examId}.xlsx`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast.error('Gagal download data peserta')
    }
  }

  const columns = [
    {
      label: 'Judul',
      render: (item: any) => (
        <Box>
          <Typography fontWeight="bold">{item.title}</Typography>
          <Typography variant="caption" color="text.secondary">
            {item.description}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Chip
              size="small"
              label={item.status}
              color={item.status === 'active' ? 'success' : 'default'}
            />
          </Box>
        </Box>
      ),
    },
    {
      label: 'Mata Pelajaran',
      render: (item: any) => <Typography>{item.subject?.nama}</Typography>,
    },
    {
      label: 'Kelas',
      render: (item: any) => (
        <Box>
          {item.classrooms?.map((classroom: any) => (
            <Chip
              key={classroom.kode}
              size="small"
              label={classroom.nama}
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Box>
      ),
    },
    {
      label: 'Jadwal',
      render: (item: any) => (
        <Box>
          <Typography variant="body2">
            {item.scheduledAt
              ? new Date(item.scheduledAt).toLocaleDateString('id-ID')
              : '-'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item.jamUjian} ({item.duration} menit)
          </Typography>
        </Box>
      ),
    },
    {
      label: 'Soal',
      render: (item: any) => (
        <Box>
          <Typography>{item.totalQuestions} soal</Typography>
          <Typography variant="caption" color="text.secondary">
            {item.totalPoints} poin
          </Typography>
        </Box>
      ),
    },
    {
      label: 'Guru',
      render: (item: any) => (
        <Box>
          <Typography>{item.teacher?.nama}</Typography>
          {item.coTeacherIds?.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              +{item.coTeacherIds.length} co-teacher
            </Typography>
          )}
        </Box>
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
                onClick={() => navigate(`/dashboard/course/${item?.id}`)}
              >
                <ListItemIcon>
                  <Details />
                </ListItemIcon>
                <ListItemText>Detail</ListItemText>
              </MenuItem>

              {(state.isAdmin || state.isInstructor) && (
                <>
                  <MenuItem
                    onClick={() => {
                      setSelectedItem(item)
                      setShowReopenDialog(true)
                    }}
                  >
                    <ListItemIcon>
                      <Replay />
                    </ListItemIcon>
                    <ListItemText>Buka Kembali</ListItemText>
                  </MenuItem>

                  <MenuItem onClick={() => handleDownloadParticipants(item.id)}>
                    <ListItemIcon>
                      <Download />
                    </ListItemIcon>
                    <ListItemText>Download Peserta</ListItemText>
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      setSelectedItem(item)
                      setShowAttendanceDialog(true)
                    }}
                  >
                    <ListItemIcon>
                      <People />
                    </ListItemIcon>
                    <ListItemText>Daftar Hadir</ListItemText>
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      setSelectedItem(item)
                      setShowOnlineStudents(true)
                    }}
                  >
                    <ListItemIcon>
                      <Visibility />
                    </ListItemIcon>
                    <ListItemText>Siswa Online</ListItemText>
                  </MenuItem>
                </>
              )}

              {item.status === 'draft' && (
                <MenuItem
                  onClick={() => {
                    setSelectedItem(item)
                    setShowDeleteConfirm(true)
                  }}
                >
                  <ListItemIcon>
                    <Delete />
                  </ListItemIcon>
                  <ListItemText>Hapus</ListItemText>
                </MenuItem>
              )}
            </>
          }
        />
      ),
    },
  ]

  return (
    <MathJaxContext>
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

              {state.isInstructor && (
                <>
                  <IconButton onClick={downloadExcelTemplate} sx={{ mr: 1 }}>
                    <Download />
                  </IconButton>

                  <IconButton
                    onClick={() => setShowUploadDialog(true)}
                    sx={{ mr: 1 }}
                  >
                    <Upload />
                  </IconButton>
                </>
              )}

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

      {/* Enhanced Form Dialog */}
      <Dialog
        open={showFormCreate}
        onClose={() => setShowFormCreate(false)}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6">Buat Soal Ujian</Typography>
            <Box>
              <Chip
                label={isDraft ? 'Draft' : 'Aktif'}
                color={isDraft ? 'default' : 'success'}
                size="small"
              />
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)}>
            <Tab label="Informasi Dasar" />
            <Tab label="Pengaturan" />
            <Tab label="Soal" />
          </Tabs>

          {/* Tab 1: Basic Information */}
          {activeTab === 0 && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Judul Ujian"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Deskripsi"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Mata Pelajaran</InputLabel>
                  <Select
                    value={formData.mataPelajaran}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mataPelajaran: e.target.value,
                      })
                    }
                    label="Mata Pelajaran"
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
                <FormControl fullWidth>
                  <InputLabel>Semester</InputLabel>
                  <Select
                    value={formData.semester}
                    onChange={(e) => {
                      setFormData({ ...formData, semester: e.target.value })
                      GetMapmataapelajara(e.target.value)
                    }}
                    label="Semester"
                  >
                    {semesterOptions.map((option: any) => (
                      <MenuItem key={option} value={option}>
                        Semester {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Jurusan</InputLabel>
                  <Select
                    value={formData.jurusan}
                    onChange={(e) =>
                      setFormData({ ...formData, jurusan: e.target.value })
                    }
                    label="jurusan"
                  >
                    {jurusansOptions.map((option: any) => (
                      <MenuItem key={option.kode} value={option.kode}>
                        {option.nama}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={kelasOptions}
                  getOptionLabel={(option) => option.nama}
                  value={formData.classroomIds
                    .map((id: any) =>
                      kelasOptions.find((k: any) => k.kode === id)
                    )
                    .filter(Boolean)}
                  onChange={(e, newValue) => {
                    setFormData({
                      ...formData,
                      classroomIds: newValue.map((v) => v.kode),
                    })
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Pilih Kelas (Multiple)" />
                  )}
                />
              </Grid>

              {/* {state.isAdmin && (
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={teacherOptions}
                    getOptionLabel={(option) => option.nama}
                    value={formData.coTeacherIds
                      .map((id: any) =>
                        teacherOptions.find((t: any) => t.kode === id)
                      )
                      .filter(Boolean)}
                    onChange={(e, newValue) => {
                      setFormData({
                        ...formData,
                        coTeacherIds: newValue.map((v) => v.kode),
                      })
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Co-Teachers (Optional)" />
                    )}
                  />
                </Grid>
              )} */}

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Tanggal Ujian"
                  type="date"
                  value={formData.tanggalUjian}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggalUjian: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Jam Ujian"
                  type="time"
                  value={formData.jamUjian}
                  onChange={(e) =>
                    setFormData({ ...formData, jamUjian: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Durasi (menit)"
                  type="number"
                  value={formData.durasiUjian}
                  onChange={(e) =>
                    setFormData({ ...formData, durasiUjian: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          )}

          {/* Tab 2: Settings */}
          {activeTab === 1 && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Instruksi Ujian"
                  multiline
                  rows={4}
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData({ ...formData, instructions: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nilai Kelulusan (%)"
                  type="number"
                  value={formData.passingScore}
                  onChange={(e) =>
                    setFormData({ ...formData, passingScore: e.target.value })
                  }
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.randomizeQuestions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            randomizeQuestions: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Acak Urutan Soal"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.randomizeAnswers}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            randomizeAnswers: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Acak Urutan Jawaban"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.requireAllAnswers}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            requireAllAnswers: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Wajib Jawab Semua Soal"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.showResults}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            showResults: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Tampilkan Hasil ke Siswa"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.allowReview}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            allowReview: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Izinkan Review Jawaban"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          )}

          {/* Tab 3: Questions */}
          {activeTab === 2 && (
            <Box sx={{ mt: 2 }}>
              {formData.soal.map((soal: any, soalIndex: any) => (
                <Card key={soalIndex} sx={{ mb: 3 }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6">Soal {soalIndex + 1}</Typography>
                      <Box>
                        <IconButton
                          color="error"
                          onClick={() => removeQuestion(soalIndex)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Tipe Soal</InputLabel>
                          <Select
                            value={soal.type || QuestionType.MULTIPLE_CHOICE}
                            onChange={(e) =>
                              handleQuestionTypeChange(
                                soalIndex,
                                e.target.value as QuestionType
                              )
                            }
                            label="Tipe Soal"
                          >
                            {Object.entries(questionTypeLabels).map(
                              ([value, label]) => (
                                <MenuItem key={value} value={value}>
                                  {label}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Poin"
                          type="number"
                          size="small"
                          value={soal.points || 1}
                          onChange={(e) => {
                            const newSoal = [...formData.soal]
                            newSoal[soalIndex].points =
                              parseInt(e.target.value) || 1
                            setFormData({ ...formData, soal: newSoal })
                          }}
                          inputProps={{ min: 1 }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Pertanyaan"
                          multiline
                          rows={3}
                          value={soal.pertanyaan}
                          onChange={(e) => {
                            const newSoal = [...formData.soal]
                            newSoal[soalIndex].pertanyaan = e.target.value
                            setFormData({ ...formData, soal: newSoal })
                          }}
                        />
                      </Grid>

                      {/* Media Upload for Question */}
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Image />}
                            component="label"
                          >
                            Upload Gambar
                            <input
                              hidden
                              accept="image/*"
                              type="file"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file)
                                  handleImageUpload(file, 'question', soalIndex)
                              }}
                            />
                          </Button>

                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<AudioFile />}
                            component="label"
                          >
                            Upload Audio
                            <input
                              hidden
                              accept="audio/*"
                              type="file"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file)
                                  handleAudioUpload(file, 'question', soalIndex)
                              }}
                            />
                          </Button>
                        </Box>

                        {soal.imageUrl && (
                          <Box sx={{ mt: 1 }}>
                            <img
                              src={soal.imageUrl}
                              alt="Question"
                              style={{ maxWidth: 200, height: 'auto' }}
                            />
                          </Box>
                        )}

                        {soal.audioUrl && (
                          <Box sx={{ mt: 1 }}>
                            <audio controls src={soal.audioUrl} />
                          </Box>
                        )}
                      </Grid>

                      {/* Math Equation */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Rumus Matematika (LaTeX)"
                          value={soal.equation || ''}
                          onChange={(e) => {
                            const newSoal = [...formData.soal]
                            newSoal[soalIndex].equation = e.target.value
                            setFormData({ ...formData, soal: newSoal })
                          }}
                          placeholder="Contoh: x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}"
                        />
                        {soal.equation && (
                          <Box
                            sx={{
                              mt: 1,
                              p: 1,
                              border: '1px solid #ccc',
                              borderRadius: 1,
                            }}
                          >
                            <MathJax>{`$$${soal.equation}$$`}</MathJax>
                          </Box>
                        )}
                      </Grid>

                      {/* Essay Keywords */}
                      {soal.type === QuestionType.ESSAY && (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Kata Kunci (pisahkan dengan koma)"
                            value={soal.keywords?.join(', ') || ''}
                            onChange={(e) => {
                              const newSoal = [...formData.soal]
                              newSoal[soalIndex].keywords = e.target.value
                                .split(',')
                                .map((k) => k.trim())
                              setFormData({ ...formData, soal: newSoal })
                            }}
                            helperText="Masukkan kata kunci yang harus ada dalam jawaban siswa"
                          />
                        </Grid>
                      )}

                      {/* Answers for non-essay questions */}
                      {soal.type !== QuestionType.ESSAY && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Pilihan Jawaban:
                          </Typography>

                          {soal.type ===
                          QuestionType.COMPLEX_MULTIPLE_CHOICE ? (
                            // Complex Multiple Choice (checkboxes)
                            <FormGroup>
                              {soal.jawaban.map(
                                (jawaban: any, jawabanIndex: any) => (
                                  <Box
                                    key={jawabanIndex}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      mb: 1,
                                    }}
                                  >
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={jawaban.isCorrect}
                                          onChange={(e) =>
                                            handleComplexAnswerChange(
                                              soalIndex,
                                              jawabanIndex,
                                              e.target.checked
                                            )
                                          }
                                        />
                                      }
                                      label={`${String.fromCharCode(65 + jawabanIndex)}.`}
                                    />
                                    <TextField
                                      fullWidth
                                      size="small"
                                      value={jawaban.text}
                                      onChange={(e) => {
                                        const newSoal = [...formData.soal]
                                        newSoal[soalIndex].jawaban[
                                          jawabanIndex
                                        ].text = e.target.value
                                        setFormData({
                                          ...formData,
                                          soal: newSoal,
                                        })
                                      }}
                                    />
                                    <Button
                                      size="small"
                                      startIcon={<Image />}
                                      component="label"
                                      sx={{ ml: 1 }}
                                    >
                                      <input
                                        hidden
                                        accept="image/*"
                                        type="file"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0]
                                          if (file)
                                            handleImageUpload(
                                              file,
                                              'answer',
                                              soalIndex,
                                              jawabanIndex
                                            )
                                        }}
                                      />
                                    </Button>
                                  </Box>
                                )
                              )}
                            </FormGroup>
                          ) : (
                            // Regular Multiple Choice and True/False (radio buttons)
                            <RadioGroup
                              value={soal.jawaban.findIndex(
                                (ans: any) => ans.isCorrect
                              )}
                              onChange={(e) => {
                                const newSoal = [...formData.soal]
                                newSoal[soalIndex].jawaban.forEach(
                                  (answer: any, idx: any) => {
                                    answer.isCorrect =
                                      idx === parseInt(e.target.value)
                                  }
                                )
                                setFormData({ ...formData, soal: newSoal })
                              }}
                            >
                              {soal.jawaban.map(
                                (jawaban: any, jawabanIndex: any) => (
                                  <Box
                                    key={jawabanIndex}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      mb: 1,
                                    }}
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
                                      onChange={(e) => {
                                        const newSoal = [...formData.soal]
                                        newSoal[soalIndex].jawaban[
                                          jawabanIndex
                                        ].text = e.target.value
                                        setFormData({
                                          ...formData,
                                          soal: newSoal,
                                        })
                                      }}
                                      disabled={
                                        soal.type === QuestionType.TRUE_FALSE
                                      }
                                    />
                                    {soal.type !== QuestionType.TRUE_FALSE && (
                                      <Button
                                        size="small"
                                        startIcon={<Image />}
                                        component="label"
                                        sx={{ ml: 1 }}
                                      >
                                        <input
                                          hidden
                                          accept="image/*"
                                          type="file"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file)
                                              handleImageUpload(
                                                file,
                                                'answer',
                                                soalIndex,
                                                jawabanIndex
                                              )
                                          }}
                                        />
                                      </Button>
                                    )}
                                  </Box>
                                )
                              )}
                            </RadioGroup>
                          )}
                        </Grid>
                      )}

                      {/* Explanation */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Penjelasan (Optional)"
                          multiline
                          rows={2}
                          value={soal.explanation || ''}
                          onChange={(e) => {
                            const newSoal = [...formData.soal]
                            newSoal[soalIndex].explanation = e.target.value
                            setFormData({ ...formData, soal: newSoal })
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}

              {/* Add Question Button - Moved to bottom */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addQuestion}
                  size="large"
                >
                  Tambah Soal
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowFormCreate(false)}>Batal</Button>
          <Button
            onClick={() => handleSubmit('draft')}
            variant="outlined"
            startIcon={<Drafts />}
          >
            Simpan Draft
          </Button>
          <Button
            onClick={() => handleSubmit('active')}
            variant="contained"
            color="primary"
            startIcon={<Save />}
          >
            Publikasi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Excel Dialog */}
      <Dialog
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
      >
        <DialogTitle>Import Soal dari Excel</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Download template Excel terlebih dahulu, lalu isi soal sesuai
              format yang disediakan.
            </Alert>
            <Button
              variant="outlined"
              onClick={downloadExcelTemplate}
              sx={{ mb: 2 }}
              fullWidth
            >
              Download Template Excel
            </Button>
            <Button variant="contained" component="label" fullWidth>
              Upload File Excel
              <input
                hidden
                accept=".xlsx,.xls"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleExcelImport(file)
                    setShowUploadDialog(false)
                  }
                }}
              />
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Reopen Exam Dialog */}
      <Dialog
        open={showReopenDialog}
        onClose={() => setShowReopenDialog(false)}
      >
        <DialogTitle>Buka Kembali Ujian</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Apakah Anda yakin ingin membuka kembali ujian "{selectedItem?.title}
            "?
          </Typography>
          <Alert severity="warning">
            Siswa yang sudah submit akan bisa mengerjakan ujian dari awal.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReopenDialog(false)}>Batal</Button>
          <Button
            onClick={() => handleReopenExam(selectedItem?.id)}
            variant="contained"
            color="warning"
          >
            Buka Kembali
          </Button>
        </DialogActions>
      </Dialog>

      {/* Online Students Dialog */}
      <OnlineStudentsDialog
        open={showOnlineStudents}
        onClose={() => setShowOnlineStudents(false)}
        examId={selectedItem?.id}
      />

      {/* Attendance Dialog */}
      <AttendanceDialog
        open={showAttendanceDialog}
        onClose={() => setShowAttendanceDialog(false)}
        examId={selectedItem?.id}
      />

      <DialogConfirm
        open={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setSelectedItem(undefined)
        }}
        title="Hapus Soal"
        content={`Yakin menghapus soal ujian "${selectedItem?.title}"?`}
        onSubmit={() => {
          // Handle delete
          setShowDeleteConfirm(false)
          toast.success('Soal ujian berhasil dihapus')
        }}
      />
    </MathJaxContext>
  )
}
