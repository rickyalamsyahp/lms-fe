import {
  Box,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TablePaginationProps,
  TableProps,
  TableRow,
} from '@mui/material'
import { CSSProperties } from 'react'

type Column = {
  label: string | any
  render: (item: any) => any
  style?: CSSProperties
}

type DataTableProps = {
  loading?: boolean
  paginationProps?: TablePaginationProps
  columns?: Column[]
  data?: any[]
  hidePaper?: boolean
  tableProps?: TableProps
  fit?: boolean
}

export default function DataTable({
  loading,
  paginationProps,
  columns,
  data,
  hidePaper,
  tableProps,
  fit = true,
}: DataTableProps) {
  const renderTable = (
    <Box
      sx={
        fit
          ? { position: 'relative', width: '100%', height: '100%', flex: 1 }
          : {}
      }
    >
      <Stack
        sx={{
          position: fit ? 'absolute' : 'relative',
          width: '100%',
          height: fit ? '100%' : 'auto',
        }}
      >
        <TableContainer
          sx={fit ? { flex: 1, width: '100%' } : {}}
          {...tableProps}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                {columns?.map((col, i) => (
                  <TableCell key={`col-${i}`}>{col.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            {loading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={columns?.length} sx={{ p: 0 }}>
                    <LinearProgress style={{ width: '100%' }} />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {data?.map((d, di) => (
                  <TableRow key={`row-${di}`}>
                    <TableCell>
                      {di +
                        1 +
                        (paginationProps
                          ? paginationProps?.rowsPerPage *
                            (paginationProps?.page - 1)
                          : 0)}
                    </TableCell>
                    {columns?.map((col, ci) => (
                      <TableCell key={`row-${di}-col-${ci}`} style={col.style}>
                        {col.render(d)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        {paginationProps && (
          <TablePagination
            {...paginationProps}
            page={paginationProps.page - 1}
            rowsPerPageOptions={undefined}
          />
        )}
      </Stack>
    </Box>
  )

  return hidePaper ? (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {renderTable}
    </Box>
  ) : (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {renderTable}
    </Paper>
  )
}
