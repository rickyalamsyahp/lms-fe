import { Box, BoxProps, Menu, MenuProps } from '@mui/material'
import React from 'react'

type DropdownProps = BoxProps & {
  trigger: React.ReactNode
  menuProps?: MenuProps
  menuList?: React.ReactNode
}

export default function Dropdown({
  trigger,
  menuProps,
  menuList,
  ...props
}: DropdownProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={{ position: 'relative' }} {...props}>
      <Box
        onClick={handleClick}
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        ria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        {trigger}
      </Box>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        {...menuProps}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {menuList}
      </Menu>
    </Box>
  )
}
