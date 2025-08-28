import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useNavigate } from '@tanstack/react-router'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useDeleteImage, ImageResponseDTO } from '../../../generated'
import { Button } from '../ui/button'

export function ImageCard({
  img,
  onDeleteSuccess,
}: {
  img: ImageResponseDTO
  onDeleteSuccess: () => void
}) {
  const navigate = useNavigate()

  const navigateTo = `annotate/${img.bucketKey}`

  const onConfirm = () => {
    navigate({ to: navigateTo }).catch(() => {
      alert('Error in image selection')
    })
  }

  const { mutate, error } = useDeleteImage(
    img.workspaceId,
    img.bucketKey,
    {},
    {
      onSuccess: () => {
        onDeleteSuccess()
      },
    },
  )

  return (
    <>
      <Card className="w-50">
        <CardContent className="p-2 flex flex-col items-center">
          {/**ANNOTATE MODAL */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="h-40">
                <img
                  src={img.url}
                  alt={img.fileName}
                  className="w-full h-32 object-cover rounded"
                />
                <p className="mt-1 text-sm font-semibold">{img.fileName}</p>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Annotation Selection</AlertDialogTitle>
                <AlertDialogDescription>
                  Do you want to annotate image <strong>{img.fileName}</strong>?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onConfirm}>Yes, go</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>

        <CardFooter className="">
          {/**DELETE MODAL*/}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="-full"
                onClick={e => {
                  e.stopPropagation()
                }}
              >
                delete{' '}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the image.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex justify-end">
                <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 text-white"
                  onClick={() => {
                    mutate(undefined)
                  }}
                >
                  Yes, delete it
                </AlertDialogAction>
              </div>
              {error && (
                <p className="text-red-600 text-sm mt-2">
                  {error.message || 'Failed to delete image'}
                </p>
              )}
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </>
  )
}
