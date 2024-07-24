'use client'

import { ArrowBack, Close, Search } from '@mui/icons-material'
import {
  Box,
  Breadcrumbs,
  BreadcrumbsProps,
  IconButton,
  InputBase,
  InputProps,
  Link,
  Paper,
  Stack,
  StackProps,
  Typography,
} from '@mui/material'
import React, { FormEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../../context/session'

type SearchProps = {
  onSearch?: (value: string) => void
  placeholder?: string
  inputProps?: InputProps
}

type CommandbarProps = StackProps & {
  title?: string
  searchProps?: SearchProps
  rightAddon?: React.ReactNode
  breadcrumbsProps?: BreadcrumbsProps & {
    items?: {
      label: string
      path?: string
    }[]
  }
}

export default function Commandbar({
  title,
  sx,
  searchProps,
  rightAddon,
  breadcrumbsProps,
  ...props
}: CommandbarProps) {
  const navigate = useNavigate()
  const { isMobile } = useSession()
  const { items: breadcrumbsItems, ...restBreadcrumbsProps } =
    breadcrumbsProps || {}
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [showSearch, setShowSearch] = useState(false)

  async function handleSearch(e: FormEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (searchProps?.onSearch) {
      try {
        setShowSearch(false)
        searchProps.onSearch(searchKeyword)
      } catch (error: any) {
        setShowSearch(true)
        toast.error(error.message)
      }
    }
  }

  const renderSearch = searchProps && (
    <>
      {isMobile && (
        <IconButton onClick={() => setShowSearch(true)}>
          <Search />
        </IconButton>
      )}
      <Box
        sx={{
          mr: 2,
          ...(isMobile
            ? {
                display: showSearch ? 'inline' : 'none !important',
                position: 'absolute',
                width: 'calc(100% - 24px)',
                left: 12,
                zIndex: 2,
              }
            : {}),
        }}
      >
        <form onSubmit={handleSearch} style={{ width: '100%' }}>
          <Paper sx={{ display: 'flex' }}>
            <IconButton type="submit">
              <Search />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder={searchProps.placeholder || 'Cari'}
              {...searchProps.inputProps}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <IconButton
              onClick={() => {
                setSearchKeyword('')
                if (searchProps.onSearch) searchProps.onSearch('')
                setShowSearch(false)
              }}
            >
              <Close />
            </IconButton>
          </Paper>
        </form>
      </Box>
    </>
  )

  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ height: 60, background: 'transparent', px: 2, ...sx }}
      {...props}
    >
      <Stack flexDirection="row" alignItems="center">
        {breadcrumbsItems && title && !isMobile ? (
          <Breadcrumbs sx={{ mr: 2 }} {...restBreadcrumbsProps}>
            {breadcrumbsItems?.map((d, i: number) =>
              d.path ? (
                <Link onClick={() => navigate(d.path as string)} key={i}>
                  {d.label}
                </Link>
              ) : (
                <Typography key={i}>{d.label}</Typography>
              )
            )}
            <Typography color="text.primary" fontWeight={500}>
              {title}
            </Typography>
          </Breadcrumbs>
        ) : title ? (
          <>
            {breadcrumbsItems && breadcrumbsItems[0].path && isMobile && (
              <Link href={breadcrumbsItems[0].path}>
                <IconButton>
                  <ArrowBack />
                </IconButton>
              </Link>
            )}
            <Typography color="text.primary" fontWeight={500}>
              {title}
            </Typography>
          </>
        ) : (
          renderSearch
        )}
      </Stack>
      <Stack flexDirection="row" alignItems="center">
        {(title || breadcrumbsItems) && renderSearch}
        {rightAddon}
      </Stack>
    </Stack>
  )
}
