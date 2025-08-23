import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
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
} from '@/components/ui/alert-dialog'
type ImageCardParams = {
  fileName: string
  url: string
}

export function ImageCard({ fileName, url }: ImageCardParams) {
  //TODO: backend endpoints not created yet, need to update when hooks are made
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const navigateTo = `annotate/${fileName}`

  const onConfirm = () => {
    setOpen(false)
    navigate({ to: navigateTo }).catch(() => {
      alert('Error in image selection')
    })
  }

  return (
    <>
      <Card
        className="w-40 cursor-pointer"
        onClick={() => {
          setOpen(true)
        }}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            setOpen(true)
          }
        }}
      >
        <CardContent className="p-2 flex flex-col items-center">
          <img src={url} alt={fileName} className="w-full h-32 object-cover rounded" />
          <p className="mt-1 text-sm font-semibold">{fileName}</p>
        </CardContent>
      </Card>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Annotation Selection</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to annotate image <strong>{fileName}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setOpen(false)
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>Yes, go</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
