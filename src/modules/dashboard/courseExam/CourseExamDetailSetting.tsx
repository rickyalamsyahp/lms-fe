/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Box, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Commandbar from '../../../components/shared/Commandbar'
import DataTable from '../../../components/shared/DataTable'
import InfiniteScroll from '../../../components/shared/InfiniteScroll'
import { useSession } from '../../../context/session'
import { useCourseExamSettingList } from './__shared/api'
import { CourseExamSetting } from './__shared/type'

export default function UserDetailOverview() {
  const { examId } = useParams()
  const { isMobile, state } = useSession()
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [search, setSearch] = useState<string>('')
  const query = {
    page,
    size,
    'type:likeLower': '%setting%',
  }

  const { data: userList, mutate: refetch } = useCourseExamSettingList(
    state.profile.scope,
    examId as string,
    {
      ...query,
      'name:likeLower': search ? `%${search}%` : undefined,
    }
  )
  useEffect(() => {
    refetch()
  }, [])
  return (
    <>
      {/* <Paper> */}
      <Stack sx={{ flex: 1, height: '100%' }}>
        <Commandbar
          title="Daftar Setting"
          searchProps={{
            onSearch: (newSearch) => setSearch(newSearch),
            placeholder: 'Cari Setting...',
          }}
          // breadcrumbsProps={{
          //   items: [
          //     {
          //       label: 'Kategori',
          //     },
          //   ],
          // }}
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
                  />
                ))} */}
              </Stack>
            </InfiniteScroll>
          ) : (
            <DataTable
              data={userList?.results}
              loading={!userList}
              columns={[
                {
                  label: 'Course Exam ID',
                  render: (item: any) => (
                    <Typography>{item.courseExamId}</Typography>
                  ),
                },
                {
                  label: 'Name',
                  render: (item: CourseExamSetting) => (
                    <Typography>{item.name}</Typography>
                  ),
                },
                {
                  label: 'Type',
                  render: (item: CourseExamSetting) => (
                    <Typography>{item.type}</Typography>
                  ),
                },
                {
                  label: 'Template',
                  render: (item: CourseExamSetting) => (
                    <Typography>{JSON.stringify(item.template)}</Typography>
                  ),
                },
                {
                  label: 'Dibuat',
                  render: (item: CourseExamSetting) => (
                    <Typography>{item.createdBy}</Typography>
                  ),
                },
              ]}
              paginationProps={{
                rowsPerPageOptions: [10, 25, 50],
                rowsPerPage: size,
                count: Number(userList?.total || 0),
                page,
                onPageChange: (e, value) => setPage(value + 1),
                onRowsPerPageChange: (e) => setSize(Number(e.target.value)),
              }}
            />
          )}
        </Box>
      </Stack>
      {/* </Paper> */}
    </>
  )
}
