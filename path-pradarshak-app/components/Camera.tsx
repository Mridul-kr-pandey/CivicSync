'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Camera as CameraIcon, X, RotateCcw, Check, AlertCircle } from 'lucide-react'

interface CameraProps {
  onCapture: (imageData: string) => void
  onClose: () => void
  isOpen: boolean
}

export default function Camera({ onCapture, onClose, isOpen }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      
      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          setIsStreaming(true)
        }
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera access denied. Please allow camera permissions and try again.')
        } else if (err.name === 'NotFoundError') {
          setError('No camera found. Please connect a camera and try again.')
        } else if (err.name === 'NotSupportedError') {
          setError('Camera not supported on this device.')
        } else {
          setError('Failed to access camera. Please try again.')
        }
      } else {
        setError('An unexpected error occurred while accessing the camera.')
      }
    }
  }, [facingMode])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsStreaming(false)
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to data URL
    const imageData = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedImage(imageData)
  }, [])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
  }, [])

  const confirmCapture = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage)
      setCapturedImage(null)
      stopCamera()
      onClose()
    }
  }, [capturedImage, onCapture, stopCamera, onClose])

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }, [])

  // Start camera when component mounts or facing mode changes
  useEffect(() => {
    if (isOpen) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isOpen, startCamera, stopCamera])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="relative w-full h-full max-w-4xl max-h-screen bg-black">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-white text-lg font-semibold">Take Photo</h2>
            <button
              onClick={switchCamera}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <RotateCcw className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Camera Feed */}
        <div className="relative w-full h-full">
          {error ? (
            <div className="flex flex-col items-center justify-center h-full text-white text-center p-8">
              <AlertCircle className="h-16 w-16 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Camera Error</h3>
              <p className="text-gray-300 mb-6">{error}</p>
              <button
                onClick={startCamera}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : capturedImage ? (
            <div className="relative w-full h-full">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
              {/* Overlay for captured image */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-xl font-semibold mb-2">Photo Captured!</h3>
                  <p className="text-gray-300">Review your photo below</p>
                </div>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
          )}

          {/* Hidden canvas for capturing */}
          <canvas
            ref={canvasRef}
            className="hidden"
          />
        </div>

        {/* Controls */}
        {!error && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/50 to-transparent p-6">
            <div className="flex justify-center items-center space-x-6">
              {capturedImage ? (
                <>
                  <button
                    onClick={retakePhoto}
                    className="p-4 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                  >
                    <RotateCcw className="h-8 w-8" />
                  </button>
                  <button
                    onClick={confirmCapture}
                    className="p-6 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                  >
                    <Check className="h-8 w-8" />
                  </button>
                  <div className="w-16 h-16"></div> {/* Spacer for alignment */}
                </>
              ) : (
                <>
                  <div className="w-16 h-16"></div> {/* Spacer for alignment */}
                  <button
                    onClick={capturePhoto}
                    disabled={!isStreaming}
                    className="p-6 rounded-full bg-white text-black hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CameraIcon className="h-8 w-8" />
                  </button>
                  <div className="w-16 h-16"></div> {/* Spacer for alignment */}
                </>
              )}
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {!isStreaming && !error && !capturedImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Starting camera...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
