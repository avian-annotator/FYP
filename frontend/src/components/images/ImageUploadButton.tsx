import React, { useState, ChangeEvent, useRef } from 'react'
import { Button } from '../ui/button'

interface Props {
  workspaceId: number
}
//TODO replace with hook when ready

const ImageUploadButton: React.FC<Props> = ({ workspaceId }) => {
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files)
    setSuccess(null)
    setError(null)
  }

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setError('Please select at least one image to upload.')
      return
    }
    setUploading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i])
    }

    try {
      const response = await fetch(`/api/workspaces/${String(workspaceId)}/images`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Upload failed')
      }

      setSuccess('Images uploaded successfully!')
      setFiles(null)

      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        id="file-upload"
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={uploading}
      />

      <Button
        onClick={e => {
          e.preventDefault()
          if (uploading) return

          if (!files || files.length === 0) {
            fileInputRef.current?.click()
          } else {
            void (async () => {
              await handleUpload()
            })()
          }
        }}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Images'}
      </Button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  )
}

export default ImageUploadButton
