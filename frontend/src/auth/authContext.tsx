import { Dispatch, SetStateAction, createContext, use } from 'react'
import { CurrentUserResponseDTO } from '../../generated'

export interface AuthContextType {
  userDetails: CurrentUserResponseDTO | undefined
  status?: number
  statusText?: string
  isAuthenticated: boolean
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = use(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
