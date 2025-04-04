
import { RouterProvider } from '@tanstack/react-router'

// Import the generated route tree
import { AuthProvider, useAuth } from './auth'
import { router } from './router'



function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}


const App = () => {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  )
}

export default App