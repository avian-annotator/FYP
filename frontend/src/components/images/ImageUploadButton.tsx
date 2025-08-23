import { useState, useRef, ChangeEvent } from 'react'
import { Button } from '../ui/button'
import { useUploadImage } from '../../../generated'

export function ImageUploadButton({
  workspaceId,
  onUploadSuccess,
}: {
  workspaceId: number
  onUploadSuccess: () => void
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { mutate } = useUploadImage(workspaceId, selectedFile)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setIsUploading(true)
    setError(null)

    mutate(
      {},
      {
        onSuccess: () => {
          onUploadSuccess()
          setSelectedFile(null)
          setIsUploading(false)
        },
        onError: err => {
          setError(err.message || 'Upload failed')
          setIsUploading(false)
        },
      },
    )
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
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Button onClick={handleButtonClick} disabled={isUploading}>
        Upload Image
      </Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
