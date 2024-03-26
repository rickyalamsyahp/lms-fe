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
}

export default function DataTable({
  loading,
  paginationProps,
  columns,
  data,
  hidePaper,
  tableProps,
}: DataTableProps) {
  const renderTable = (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', flex: 1 }}>
      <Stack
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      >
        <TableContainer sx={{ flex: 1, width: '100%' }} {...tableProps}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
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
