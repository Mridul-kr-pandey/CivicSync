'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  AlertTriangle, 
  X, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Send
} from 'lucide-react'

interface SOSAlertProps {
  isOpen: boolean
  onClose: () => void
  onSendAlert: (alertData: SOSAlertData) => void
}

interface SOSAlertData {
  type: 'medical' | 'safety' | 'fire' | 'police' | 'other'
  location: {
    latitude: number
    longitude: number
    address: string
  }
  message: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  timestamp: number
}

const emergencyTypes = [
  { id: 'medical', label: 'Medical Emergency', icon: '🏥', color: 'text-red-600' },
  { id: 'safety', label: 'Safety Threat', icon: '⚠️', color: 'text-orange-600' },
  { id: 'fire', label: 'Fire Emergency', icon: '🔥', color: 'text-red-500' },
  { id: 'police', label: 'Police Required', icon: '🚔', color: 'text-blue-600' },
  { id: 'other', label: 'Other Emergency', icon: '🚨', color: 'text-purple-600' }
]

const priorityLevels = [
  { id: 'low', label: 'Low', color: 'text-green-600' },
  { id: 'medium', label: 'Medium', color: 'text-yellow-600' },
  { id: 'high', label: 'High', color: 'text-orange-600' },
  { id: 'critical', label: 'Critical', color: 'text-red-600' }
]

export default function SOSAlert({ isOpen, onClose, onSendAlert }: SOSAlertProps) {
  const [alertType, setAlertType] = useState<string>('')
  const [priority, setPriority] = useState<string>('high')
  const [message, setMessage] = useState('')
  const [location, setLocation] = useState<{latitude: number, longitude: number, address: string} | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  
  const countdownRef = useRef<NodeJS.Timeout | null>(null)

  // Get user's current location
  const getCurrentLocation = async () => {
    setIsGettingLocation(true)
    setLocationError(null)
    
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser')
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        })
      })

      const { latitude, longitude } = position.coords
      
      // Reverse geocoding to get address
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        )
        const data = await response.json()
        const address = data.localityInfo?.administrative?.[0]?.name || 
                       data.localityInfo?.administrative?.[1]?.name || 
                       `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        
        setLocation({ latitude, longitude, address })
      } catch (error) {
        // Fallback to coordinates if reverse geocoding fails
        setLocation({ 
          latitude, 
          longitude, 
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` 
        })
      }
    } catch (error) {
      console.error('Error getting location:', error)
      if (error instanceof Error) {
        if (error.message.includes('denied')) {
          setLocationError('Location access denied. Please enable location permissions.')
        } else if (error.message.includes('timeout')) {
          setLocationError('Location request timed out. Please try again.')
        } else {
          setLocationError('Failed to get location. Please try again.')
        }
      } else {
        setLocationError('An unexpected error occurred while getting location.')
      }
    } finally {
      setIsGettingLocation(false)
    }
  }

  // Start countdown when alert type is selected
  useEffect(() => {
    if (alertType && !countdown) {
      setCountdown(10)
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            if (countdownRef.current) {
              clearInterval(countdownRef.current)
            }
            return null
          }
          return prev - 1
        })
      }, 1000)
    }
  }, [alertType, countdown])

  // Cleanup countdown on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
      }
    }
  }, [])

  const handleSendAlert = async () => {
    if (!alertType || !location) return

    setIsSending(true)
    
    try {
      const alertData: SOSAlertData = {
        type: alertType as any,
        location,
        message: message.trim() || 'Emergency assistance required',
        priority: priority as any,
        timestamp: Date.now()
      }

      await onSendAlert(alertData)
      
      // Show success message briefly before closing
      setTimeout(() => {
        onClose()
        resetForm()
      }, 2000)
    } catch (error) {
      console.error('Error sending alert:', error)
    } finally {
      setIsSending(false)
    }
  }

  const resetForm = () => {
    setAlertType('')
    setPriority('high')
    setMessage('')
    setLocation(null)
    setLocationError(null)
    setCountdown(null)
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-red-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 mr-3" />
              <div>
                <h2 className="text-2xl font-bold">Emergency SOS Alert</h2>
                <p className="text-red-100">Send alert to nearby users and emergency services</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-red-700 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Emergency Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Emergency Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {emergencyTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setAlertType(type.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    alertType === type.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{type.icon}</span>
                    <span className={`font-medium ${type.color}`}>{type.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Priority Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Priority Level
            </label>
            <div className="flex space-x-2">
              {priorityLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setPriority(level.id)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    priority === level.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`font-medium ${level.color}`}>{level.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Location *
            </label>
            {location ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center text-green-800">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="font-medium">{location.address}</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors disabled:opacity-50"
                >
                  {isGettingLocation ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-2"></div>
                      Getting location...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-5 w-5 mr-2" />
                      Get Current Location
                    </>
                  )}
                </button>
                {locationError && (
                  <p className="text-red-600 text-sm flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {locationError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Additional Details (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the emergency situation..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Countdown Timer */}
          {countdown && countdown > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800 font-medium">
                  Auto-sending in {countdown} seconds...
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendAlert}
              disabled={!alertType || !location || isSending}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending Alert...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Send SOS Alert
                </>
              )}
            </button>
          </div>

          {/* Emergency Contacts Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Emergency Contacts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>Police: 100</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>Fire: 101</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>Medical: 102</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                <span>WhatsApp: +91-XXXXXXXXXX</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
