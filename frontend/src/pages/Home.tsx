import { Navigate, Link } from '@tanstack/react-router'
import { useAuth } from '@/auth'
import { Button } from '@/components/ui/button'
import demoImage from '@/assets/demo-image.png'

export function Home() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/workspaces" />
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold">Welcome to Avian Annotator</h1>
      <img
              src={demoImage}
              alt="Demo"
              className="max-w-2xl rounded-lg shadow-lg"
            />
      <p className="text-lg text-muted-foreground">
       Annotate images of birds, in real time.
      </p>
    </div>
  )
}
