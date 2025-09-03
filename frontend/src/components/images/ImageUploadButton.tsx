import { useState, useRef, ChangeEvent } from 'react'
import { Button } from '../ui/button'
import { useUploadImage } from '../../../generated'
//TODO add multiple file upload
export function ImageUploadButton({
  workspaceId,
  onUploadSuccess,
}: {
  workspaceId: number
  onUploadSuccess: () => void
}) {
  const dummyFile = new File([], 'dummy.txt')
  const [selectedFile, setSelectedFile] = useState<File>(dummyFile)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  //TOOD: fix the upload image hook
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
          setSelectedFile(dummyFile)
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
