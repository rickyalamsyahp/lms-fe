/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Box, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import Commandbar from '../../../components/shared/Commandbar'
import DataTable from '../../../components/shared/DataTable'
import { DialogConfirm } from '../../../components/shared/Dialog/DialogConfirm'
import InfiniteScroll from '../../../components/shared/InfiniteScroll'
import { useSession } from '../../../context/session'
import { options } from '../../../libs/http'
import UserForm from './__components/SubmissionForm'
import { deleteExam, useSubmissionList } from './__shared/api'
import { SubmissionExam } from './__shared/type'

type SubmissionListProps = {
  asPage?: boolean
  owner?: string
}

export default function SubmissionList({
  asPage = true,
  owner,
}: SubmissionListProps) {
  const { isMobile } = useSession()
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [search, setSearch] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SubmissionExam | undefined>()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const query = {
    page,
    size,
    ...(owner ? { 'owner:eq': owner } : {}),
  }

  const { data: examList, mutate: refetch } = useSubmissionList(
    options.publicScope,
    {
      ...query,
      'trainee.name:likeLower': search ? `%${search}%` : undefined,
    }
  )
  useEffect(() => {
    refetch()
  }, [])
  async function handleDelete() {
    try {
      await deleteExam(selectedItem?.id as string)
      refetch()
    } catch (error) {
      throw error
    }
  }

  const renderContent = (
    <DataTable
      fit={asPage}
      data={examList?.results}
      loading={!examList}
      columns={[
        {
          label: 'Trainee',
          render: (item: any) => <Typography>{item?.trainee?.name}</Typography>,
        },
        {
          label: 'Modul',
          render: (item: any) => <Typography>{item?.course.title}</Typography>,
        },
        {
          label: 'Exam/Pelatihan',
          render: (item: any) => (
            <Typography>{item?.courseExam.title}</Typography>
          ),
        },
        {
          label: 'Status',
          render: (item: any) => <Typography>{item.status}</Typography>,
        },
        {
          label: 'Nilai/Skor',
          render: (item: any) => <Typography>{item.score || '-'}</Typography>,
        },
        {
          label: 'Tanggal Dibuat',
          render: (item: SubmissionExam) => (
            <Typography sx={{ minWidth: 160 }}>
              {dayjs(item.createdAt).format('DD MMM YYYY HH:mm:ss')}
            </Typography>
          ),
        },
      ]}
      paginationProps={{
        rowsPerPageOptions: [10, 25, 50],
        rowsPerPage: size,
        count: Number(examList?.total || 0),
        page,
        onPageChange: (e, value) => setPage(value),
        onRowsPerPageChange: (e) => setSize(Number(e.target.value)),
      }}
    />
  )

  return asPage ? (
    <>
      <Stack sx={{ flex: 1 }}>
        <Commandbar
          title="Daftar Submission"
          searchProps={{
            onSearch: (newSearch) => setSearch(newSearch),
            placeholder: 'Cari Trainee...',
          }}
          breadcrumbsProps={{
            items: [
              {
                label: 'Menu Utama',
              },
            ],
          }}
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
            renderContent
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
      />
      <DialogConfirm
        open={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setSelectedItem(undefined)
        }}
        title="Delete"
        content={`Yakin menghapus course ini?`}
        onSubmit={handleDelete}
      />
    </>
  ) : (
    renderContent
  )
}
