import { Button } from '../ui/button'
import JSZip from 'jszip'
import { useGeneratePresignedDownloadUrlForImages } from '../../../generated'
import axios from 'axios'
import saveAs from 'file-saver'
//TODO add include annotations with export logic
export function ImageExportButton({ workspaceId }: { workspaceId: number }) {
  const { refetch } = useGeneratePresignedDownloadUrlForImages(
    workspaceId,
    { includeAnnotations: false },
    {},
  )

  const handleDownloadZip = async () => {
    const { data, error } = await refetch()
    if (error) {
      return (
        <p className="text-red-500">
          Error: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      )
    }
    const imageData = data?.data.content === undefined ? [] : data.data.content
    if (imageData.length === 0) return
    const zip = new JSZip()

    await Promise.all(
      imageData.map(async image => {
        const response = await axios.get<Blob>(image.url, { responseType: 'blob' })
        zip.file(image.fileName, response.data)
      }),
    )
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    saveAs(zipBlob, 'images.zip')
  }

  return (
    <div>
      <Button onClick={() => void handleDownloadZip()}>Download Images</Button>
    </div>
  )
}
