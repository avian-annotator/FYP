import { Button } from '../ui/button'
import JSZip from 'jszip'
import { useGeneratePresignedDownloadUrlForImages } from '../../../generated'
import axios from 'axios'
import saveAs from 'file-saver'
import CanvasExport from '../canvas/CanvasExport'

export function ImageExportButton({ workspaceId }: { workspaceId: number }) {
  const { refetch } = useGeneratePresignedDownloadUrlForImages(
    workspaceId,
    { includeAnnotations: true },
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

    const imagesWithAnnotations = imageData.filter(img => img.annotations !== undefined)

    if (imagesWithAnnotations.length > 0) {
      const images = imagesWithAnnotations.map((img, idx) => {
        const binary = atob(img.annotations as unknown as string)
        const len = binary.length
        const uint8Array = new Uint8Array(len)
        for (let i = 0; i < len; i++) {
          uint8Array[i] = binary.charCodeAt(i)
        }
        return {
          imageId: idx,
          update: uint8Array,
          fileName: img.fileName,
        }
      })

      const cocoJson = CanvasExport(images, 'COCOJSON')
      zip.file('annotations.json', cocoJson)
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    saveAs(zipBlob, `images_${String(workspaceId)}.zip`)
  }

  return (
    <div>
      <Button onClick={() => void handleDownloadZip()}>Download Images</Button>
    </div>
  )
}
