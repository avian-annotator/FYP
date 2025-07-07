
import { RouterProvider } from '@tanstack/react-router'

// Import the generated route tree
import { AuthProvider, useAuth } from './auth'
import { router } from './router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'



function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </QueryClientProvider>

  )
}

export default App