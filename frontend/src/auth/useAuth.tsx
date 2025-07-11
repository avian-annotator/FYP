import { use } from 'react'
import { AuthContextType } from '.'
import { AuthContext } from './authContext'

export const useAuth = (): AuthContextType => {
  const context = use(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
