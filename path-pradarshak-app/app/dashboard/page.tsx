'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Camera from '@/components/Camera'
import SOSAlert from '@/components/SOSAlert'
import AlertManager from '@/components/AlertManager'
import VoiceCommand from '@/components/VoiceCommand'
import { alertService } from '@/services/alertService'
import { voiceCommandProcessor } from '@/services/voiceCommandProcessor'
import {
  AlertTriangle,
  ClipboardList,
  Users,
  Camera as CameraIcon,
  Image as ImageIcon,
  X,
  Download,
  Share2,
  Siren,
  Shield,
  Bell,
  Mic
} from 'lucide-react'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Camera and image management state
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // SOS and alert management state
  const [isSOSOpen, setIsSOSOpen] = useState(false)
  const [isAlertManagerOpen, setIsAlertManagerOpen] = useState(false)
  const [activeAlerts, setActiveAlerts] = useState(0)

  // Voice command state
  const [showVoiceCommand, setShowVoiceCommand] = useState(false)

  // Set page title
  useEffect(() => {
    document.title = 'Dashboard – CivicSync'
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  // Load saved images from localStorage
  useEffect(() => {
    const savedImages = localStorage.getItem('civicSync_capturedImages')
    if (savedImages) {
      try {
        setCapturedImages(JSON.parse(savedImages))
      } catch (error) {
        console.error('Error loading saved images:', error)
      }
    }
  }, [])

  // Save images to localStorage whenever capturedImages changes
  useEffect(() => {
    if (capturedImages.length > 0) {
      localStorage.setItem('civicSync_capturedImages', JSON.stringify(capturedImages))
    }
  }, [capturedImages])

  // Monitor active alerts
  useEffect(() => {
    const unsubscribe = alertService.subscribeToAlerts((alerts) => {
      const active = alerts.filter(alert => alert.status === 'active').length
      setActiveAlerts(active)
    })
    return unsubscribe
  }, [])

  const handleImageCapture = (imageData: string) => {
    setCapturedImages(prev => [imageData, ...prev])
  }

  const removeImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index))
    if (selectedImage === capturedImages[index]) {
      setSelectedImage(null)
    }
  }

  const downloadImage = (imageData: string, index: number) => {
    const link = document.createElement('a')
    link.href = imageData
    link.download = `civic-sync-photo-${Date.now()}-${index}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const shareImage = async (imageData: string) => {
    if (navigator.share) {
      try {
        // Convert data URL to blob
        const response = await fetch(imageData)
        const blob = await response.blob()
        const file = new File([blob], 'civic-sync-photo.jpg', { type: 'image/jpeg' })

        await navigator.share({
          title: 'CivicSync Photo',
          text: 'Photo captured with CivicSync',
          files: [file]
        })
      } catch (error) {
        console.error('Error sharing image:', error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        const response = await fetch(imageData)
        const blob = await response.blob()
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/jpeg': blob })
        ])
        alert('Image copied to clipboard!')
      } catch (error) {
        console.error('Error copying to clipboard:', error)
      }
    }
  }

  const handleSOSAlert = async (alertData: any) => {
    try {
      const alert = await alertService.sendSOSAlert({
        ...alertData,
        senderId: user?._id || 'anonymous',
        senderName: user?.name || 'Anonymous User'
      })
      console.log('SOS Alert sent successfully:', alert)
    } catch (error) {
      console.error('Error sending SOS alert:', error)
    }
  }

  // Voice command handler
  const handleVoiceCommand = (action: string, command: any) => {
    console.log('Voice command received:', action, command)

    switch (action) {
      case 'capture_photo':
        setIsCameraOpen(true)
        break
      case 'sos_alert':
        setIsSOSOpen(true)
        break
      case 'report_issue':
        router.push('/issues/report')
        break
      case 'open_issues':
        router.push('/issues')
        break
      case 'open_community':
        router.push('/community-issues')
        break
      case 'open_profile':
        router.push('/profile')
        break
      case 'help':
        setShowVoiceCommand(true)
        break
      case 'cancel':
        // Close any open modals
        setIsCameraOpen(false)
        setIsSOSOpen(false)
        setIsAlertManagerOpen(false)
        setShowVoiceCommand(false)
        break
      default:
        console.log('Unknown voice command action:', action)
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="h-16"></div>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.name}! Ready to improve your city?</span>
              <Link href="/profile" className="btn btn-secondary">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Voice Command Bar */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center text-blue-800">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm font-medium">Voice Commands Available</span>
              </div>
              <button
                onClick={() => setShowVoiceCommand(!showVoiceCommand)}
                className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showVoiceCommand ? 'Hide' : 'Show'} Voice Controls
              </button>
            </div>
            <div className="text-sm text-blue-600">
              Say "help" to see available commands
            </div>
          </div>
        </div>
      </div>

      {/* Voice Command Interface */}
      {showVoiceCommand && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <VoiceCommand onCommand={handleVoiceCommand} />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Message */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What would you like to do today?
          </h2>
          <p className="text-lg text-gray-600">
            Choose an action below to report, track, or manage civic issues.
          </p>
        </div>

        {/* Emergency Alert Banner */}
        {activeAlerts > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Siren className="h-6 w-6 text-red-600 mr-3 animate-pulse" />
                <div>
                  <h3 className="font-semibold text-red-900">Active Emergency Alerts</h3>
                  <p className="text-sm text-red-700">{activeAlerts} emergency alert(s) in your area</p>
                </div>
              </div>
              <button
                onClick={() => setIsAlertManagerOpen(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <Bell className="h-4 w-4 mr-2" />
                View Alerts
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Emergency SOS Button */}
          <button
            onClick={() => setIsSOSOpen(true)}
            className="card hover:shadow-lg transition-all transform hover:scale-105 bg-gradient-to-br from-red-500 to-red-600 text-white border-red-500"
          >
            <div className="text-center">
              <Siren className="h-12 w-12 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-bold mb-2">SOS ALERT</h3>
              <p className="text-red-100 text-sm">Emergency assistance required</p>
            </div>
          </button>

          <Link href="/issues/report" className="card hover:shadow-md transition-shadow">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Report an Issue</h3>
              <p className="text-gray-600">Submit a civic issue with photo and location.</p>
            </div>
          </Link>

          <button
            onClick={() => setIsCameraOpen(true)}
            className="card hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="text-center">
              <CameraIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Capture</h3>
              <p className="text-gray-600">Take a photo instantly for reporting issues.</p>
            </div>
          </button>

          <Link href="/issues" className="card hover:shadow-md transition-shadow">
            <div className="text-center">
              <ClipboardList className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">My Issues</h3>
              <p className="text-gray-600">View and track the status of your submitted issues.</p>
            </div>
          </Link>

          <Link href="/community-issues" className="card hover:shadow-md transition-shadow">
            <div className="text-center">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Issues</h3>
              <p className="text-gray-600">Browse issues reported by other citizens.</p>
            </div>
          </Link>
        </div>

        {/* Emergency Management Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-red-600" />
              Emergency Management
            </h2>
            <button
              onClick={() => setIsAlertManagerOpen(true)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
            >
              <Bell className="h-4 w-4 mr-2" />
              Manage Alerts
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="font-medium text-gray-900">Active Alerts</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{activeAlerts}</p>
              <p className="text-sm text-gray-500">Emergency situations</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="font-medium text-gray-900">Response Time</span>
              </div>
              <p className="text-2xl font-bold text-green-600">&lt; 5min</p>
              <p className="text-sm text-gray-500">Average response</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="font-medium text-gray-900">Coverage</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">5km</p>
              <p className="text-sm text-gray-500">Alert radius</p>
            </div>
          </div>
        </div>

        {/* Captured Images Gallery */}
        {capturedImages.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <ImageIcon className="h-6 w-6 mr-2 text-primary-600" />
                Recent Photos ({capturedImages.length})
              </h2>
              <button
                onClick={() => setCapturedImages([])}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {capturedImages.slice(0, 12).map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Captured ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedImage(image)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          downloadImage(image, index)
                        }}
                        className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4 text-gray-700" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          shareImage(image)
                        }}
                        className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                        title="Share"
                      >
                        <Share2 className="h-4 w-4 text-gray-700" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage(index)
                        }}
                        className="p-1 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors"
                        title="Delete"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {capturedImages.length > 12 && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                Showing 12 of {capturedImages.length} photos
              </p>
            )}
          </div>
        )}

        {/* Image Preview Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <img
                src={selectedImage}
                alt="Preview"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}

        {/* Camera Component */}
        <Camera
          isOpen={isCameraOpen}
          onClose={() => setIsCameraOpen(false)}
          onCapture={handleImageCapture}
        />

        {/* SOS Alert Component */}
        <SOSAlert
          isOpen={isSOSOpen}
          onClose={() => setIsSOSOpen(false)}
          onSendAlert={handleSOSAlert}
        />

        {/* Alert Manager Component */}
        <AlertManager
          isOpen={isAlertManagerOpen}
          onClose={() => setIsAlertManagerOpen(false)}
        />

        {/* Floating Voice Command Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <div className="relative">
            <button
              onClick={() => setShowVoiceCommand(!showVoiceCommand)}
              className="p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
              title="Voice Commands"
            >
              <Mic className="h-6 w-6" />
            </button>
            {!showVoiceCommand && (
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}