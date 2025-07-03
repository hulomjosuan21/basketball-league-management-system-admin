// components/ui/file-upload.tsx
import * as React from "react"
import { useDropzone, DropzoneOptions } from "react-dropzone"
import { cn } from "@/lib/utils"

export interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: File[]
    onValueChange?: (files: File[]) => void
    dropzoneOptions?: DropzoneOptions
}

export function FileUploader({
    value = [],
    onValueChange,
    dropzoneOptions,
    className,
    children,
    ...props
}: FileUploaderProps) {
    const onDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            onValueChange?.([...value, ...acceptedFiles])
        },
        [onValueChange, value]
    )

    const { getRootProps, getInputProps } = useDropzone({
        ...dropzoneOptions,
        onDrop,
    })

    return (
        <div {...getRootProps()} className={cn("cursor-pointer", className)} {...props}>
            <input {...getInputProps()} />
            {children}
        </div>
    )
}

export interface FileInputProps extends React.HTMLAttributes<HTMLDivElement> { }

export function FileInput({ className, ...props }: FileInputProps) {
    return <div className={cn("border border-dashed rounded-md", className)} {...props} />
}

export interface FileUploaderContentProps extends React.HTMLAttributes<HTMLDivElement> { }

export function FileUploaderContent({ className, ...props }: FileUploaderContentProps) {
    return <div className={cn("mt-2 space-y-2", className)} {...props} />
}

export interface FileUploaderItemProps extends React.HTMLAttributes<HTMLDivElement> {
    index: number
}

export function FileUploaderItem({ className, children, ...props }: FileUploaderItemProps) {
    return (
        <div className={cn("flex items-center gap-2 text-sm", className)} {...props}>
            {children}
        </div>
    )
}
