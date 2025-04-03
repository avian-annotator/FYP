import { FC, ReactNode } from 'react'

interface DefaultLayoutProps {
  children: ReactNode
}

const DefaultLayout: FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <div>
      DefaultLayout
      {children}
    </div>
  )
}

export default DefaultLayout