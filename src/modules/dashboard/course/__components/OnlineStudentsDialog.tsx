import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

function OnlineStudentsDialog({ open, onClose, examId }: any) {
  const [onlineStudents, setOnlineStudents] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && examId) {
      fetchOnlineStudents()
    }
  }, [open, examId])

  const fetchOnlineStudents = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/question-bank/online-students?questionBankId=${examId}`
      )
      const data = await response.json()
      setOnlineStudents(data.data)
    } catch (error) {
      console.error('Failed to fetch online students:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Siswa Online Saat Ini</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Total: {onlineStudents.length} siswa online
            </Typography>
            {onlineStudents.map((student: any) => (
              <Box
                key={student.id}
                sx={{ p: 1, border: '1px solid #eee', borderRadius: 1, mb: 1 }}
              >
                <Typography>{student.student?.nama}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Login: {new Date(student.loginTime).toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Tutup</Button>
      </DialogActions>
    </Dialog>
  )
}

export default OnlineStudentsDialog
