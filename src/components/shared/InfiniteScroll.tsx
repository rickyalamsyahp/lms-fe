import { ComponentProps } from 'react'

type InfiniteScrollProps = ComponentProps<'div'>

export default function InfiniteScroll({
  children,
  ...props
}: InfiniteScrollProps) {
  return <div {...props}>{children}</div>
}
