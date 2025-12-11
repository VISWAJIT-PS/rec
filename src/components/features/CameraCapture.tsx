import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface CameraCaptureProps {
    onCapture: (file: File) => void
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [error, setError] = useState<string>('')

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            })
            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
            setError('')
        } catch (err) {
            console.error(err)
            setError('Camera access denied or unavailable. Please enable permissions.')
        }
    }

    const stopCamera = () => {
        stream?.getTracks().forEach(track => track.stop())
        setStream(null)
    }

    const capture = () => {
        if (!videoRef.current) return
        const canvas = document.createElement('canvas')
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(videoRef.current, 0, 0)

        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], "selfie.jpg", { type: "image/jpeg" })
                onCapture(file)
            }
        }, 'image/jpeg', 0.8)
    }

    useEffect(() => {
        startCamera()
        return () => stopCamera()
    }, [])

    if (error) return <div className="text-destructive text-center p-4 bg-destructive/10 rounded">{error} <Button variant="link" onClick={startCamera}>Retry</Button></div>

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-black w-full aspect-[3/4] max-w-sm flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                {/* scale-x-[-1] to mirror the view like a real mirror */}
            </div>
            <p className="text-sm text-muted-foreground">Align your face and click capture</p>
            <div className="flex gap-4">
                <Button onClick={capture} className="rounded-full w-16 h-16 flex items-center justify-center p-0 bg-white border-4 border-primary hover:bg-gray-100 shadow-lg transition-transform hover:scale-105">
                    <div className="w-12 h-12 bg-primary rounded-full"></div>
                </Button>
            </div>
        </div>
    )
}
