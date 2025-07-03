import { useCallback, useEffect, useState } from "react"
import Cropper from "react-easy-crop"
import { Upload, X } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "./ui/dialog"
import { cn } from "@/lib/utils"
import { getCroppedImg } from "@/helpers/getCroppedImg"

type ImageUploaderProps = {
  value?: string
  onChange?: (value: string) => void
  aspectRatio?: number
}

export default function ImageUploader({
  value,
  onChange,
  aspectRatio = 1,
}: ImageUploaderProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(value ?? "")
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [showCropModal, setShowCropModal] = useState(false)

  useEffect(() => {
    setImagePreview(value ?? "")
  }, [value])

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(reader.result as string)
      setShowCropModal(true)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileUpload(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const removeFile = () => {
    setImagePreview("")
    if (onChange) onChange("")
  }

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
    setImagePreview(croppedImage)
    setShowCropModal(false)
    if (onChange) onChange(croppedImage)
  }

  return (
    <>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          "hover:border-primary/50 hover:bg-primary/5",
          imagePreview ? "border-primary" : "border-gray-300"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById("image-input")?.click()}
      >
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Image preview"
              className="mx-auto h-32 w-32 object-contain rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={(e) => {
                e.stopPropagation()
                removeFile()
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-sm font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">PNG, JPG, max 10MB</p>
          </div>
        )}
        <input
          id="image-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileUpload(file)
          }}
        />
      </div>

      {/* Crop Modal */}
      <Dialog open={showCropModal} onOpenChange={setShowCropModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <p className="text-lg font-semibold">Crop Image</p>
          </DialogHeader>
          <div className="relative w-full h-[400px] bg-black rounded-md overflow-hidden">
            <Cropper
              image={imageSrc!}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setShowCropModal(false)}>Cancel</Button>
            <Button onClick={handleCropSave}>Crop</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
