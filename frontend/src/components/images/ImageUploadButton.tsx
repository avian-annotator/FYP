import { useState, useRef, ChangeEvent } from 'react'
import { Button } from '../ui/button'
import { useUploadMultipleImages } from '@/lib/utils'

export function ImageUploadButton({
  workspaceId,
  onUploadSuccess,
}: {
  workspaceId: number
  onUploadSuccess: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { mutateAsync } = useUploadMultipleImages(workspaceId)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    setError(null)

    try {
      await Promise.all(files.map(file => mutateAsync({ file })))
      onUploadSuccess()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(String(err))
      }
    }
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    }
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={void handleFileChange}
        style={{ display: 'none' }}
      />
      <Button onClick={handleButtonClick}>Upload Image</Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
