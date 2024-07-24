'use client'

import { Close, Search } from '@mui/icons-material'
import { Box, BoxProps, IconButton, InputBase, Stack } from '@mui/material'
import { FormEvent, useEffect, useRef, useState } from 'react'

type SearchbarProps = BoxProps & {
  offset?: number
  onSearch: (__searchKeyword: string) => void
}

export default function Searchbar({
  sx,
  offset = 0,
  onSearch,
  ...props
}: SearchbarProps) {
  const elemRef = useRef<any>()
  const isStickyRef = useRef(false)
  const [searchKeyword, setSearchKeyword] = useState('')

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    e.stopPropagation()
    onSearch(searchKeyword as string)
  }

  useEffect(() => {
    const topPos = Number(elemRef.current?.offsetTop || 0) - offset
    const handleScroll = () => {
      if (elemRef.current) {
        const currY = window.scrollY
        console.log(currY)
        isStickyRef.current = currY >= topPos
        elemRef.current.setAttribute(
          'data-position',
          isStickyRef.current ? 'sticky' : 'relative'
        )
        // topSticky.current.setAttribute('data-sticky', isStickyRef);
        // onSticky(isStickyRef);

        // if (autoHide && topSticky.current) {
        //   topSticky.current.classList[lastPos > currY ? 'add' : 'remove']('show');
        // }

        // lastPos = window.scrollY;
      }
    }

    document.addEventListener('scroll', handleScroll)
    return () => {
      // window.removeEventListener('scroll', handleScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elemRef])

  return (
    <div ref={elemRef} className="searchbar">
      <Box
        sx={{
          width: '100%',
          py: 2,
          ...sx,
        }}
        {...props}
      >
        <Stack
          flexDirection={'row'}
          alignItems={'center'}
          sx={{ px: 2, mb: 2, gap: 2 }}
        >
          <img
            src="/hnfh-logo.svg"
            alt="hnfh logo"
            width={64}
            height={64}
            className="logo"
            style={{ display: 'none' }}
          />
          <form
            style={{
              flex: 1,
            }}
            onSubmit={handleSearch}
          >
            <Stack
              alignItems={'center'}
              direction={'row'}
              sx={{
                borderRadius: 24,
                border: 'thin solid black',
                height: 48,
                background: 'white',
                px: 2,
              }}
            >
              <Search />
              <Box sx={{ mx: 2, flex: 1 }}>
                <InputBase
                  sx={{ flex: 1 }}
                  placeholder="Search here..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </Box>
              <IconButton
                onClick={() => {
                  setSearchKeyword('')
                  onSearch('')
                }}
              >
                <Close />
              </IconButton>
            </Stack>
          </form>
        </Stack>
      </Box>
      <style>{`
        .searchbar {
          top: 0;
          position: sticky;
        }
        .searchbar[data-position='sticky'] {
          background: #ffffffea;
        }
        .searchbar[data-position='sticky'] .logo {
          display: inline !important;
        }
      `}</style>
    </div>
  )
}
