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
import { ImageItem } from '@/lib/types'

export function ImageCard({ filename, url }: ImageItem) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const navigateTo = `annotate/${filename}`

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
          <img src={url} alt={filename} className="w-full h-32 object-cover rounded" />
          <p className="mt-1 text-sm font-semibold">{filename}</p>
        </CardContent>
      </Card>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Annotation Selection</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to annotate image <strong>{filename}</strong>?
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
