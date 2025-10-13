import UserCard from '@/components/users/UserCard'
import { useGetMe } from '../../generated'

export function Me() {
  const { data, isLoading } = useGetMe({ withCredentials: true })

  if (isLoading || !data?.data) {
    return <p>Loading...</p>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="max-w-2xl">
        <UserCard user={data.data} workspaceId={-1} showEdit={true} />
      </div>
    </div>
  )
}

export default Me
