'use client'

import { useState, useEffect } from 'react'
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Users, 
  Phone, 
  MessageCircle,
  CheckCircle,
  X,
  Eye,
  EyeOff
} from 'lucide-react'
import { alertService, SOSAlertData, NearbyUser } from '@/services/alertService'

interface AlertManagerProps {
  isOpen: boolean
  onClose: () => void
}

const emergencyTypeLabels = {
  medical: 'Medical Emergency',
  safety: 'Safety Threat',
  fire: 'Fire Emergency',
  police: 'Police Required',
  other: 'Other Emergency'
}

const priorityColors = {
  low: 'text-green-600 bg-green-100',
  medium: 'text-yellow-600 bg-yellow-100',
  high: 'text-orange-600 bg-orange-100',
  critical: 'text-red-600 bg-red-100'
}

const statusColors = {
  active: 'text-red-600 bg-red-100',
  resolved: 'text-green-600 bg-green-100',
  cancelled: 'text-gray-600 bg-gray-100'
}

export default function AlertManager({ isOpen, onClose }: AlertManagerProps) {
  const [alerts, setAlerts] = useState<SOSAlertData[]>([])
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([])
  const [selectedAlert, setSelectedAlert] = useState<SOSAlertData | null>(null)
  const [showResolved, setShowResolved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    setIsLoading(true)
    
    // Load initial data
    setAlerts(alertService.getAlerts())
    setNearbyUsers(alertService.getNearbyUsers())

    // Subscribe to updates
    const unsubscribeAlerts = alertService.subscribeToAlerts(setAlerts)
    const unsubscribeUsers = alertService.subscribeToNearbyUsers(setNearbyUsers)

    setIsLoading(false)

    return () => {
      unsubscribeAlerts()
      unsubscribeUsers()
    }
  }, [isOpen])

  const handleUpdateStatus = (alertId: string, status: 'active' | 'resolved' | 'cancelled') => {
    alertService.updateAlertStatus(alertId, status)
  }

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const filteredAlerts = alerts.filter(alert => 
    showResolved || alert.status === 'active'
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 mr-3" />
              <div>
                <h2 className="text-2xl font-bold">Emergency Alerts</h2>
                <p className="text-gray-300">Manage and respond to emergency alerts</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Alerts List */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Active Alerts</h3>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={showResolved}
                    onChange={(e) => setShowResolved(e.target.checked)}
                    className="mr-2"
                  />
                  Show Resolved
                </label>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                </div>
              ) : filteredAlerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No alerts found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => setSelectedAlert(alert)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAlert?.id === alert.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="text-lg mr-2">
                              {alert.type === 'medical' && '🏥'}
                              {alert.type === 'safety' && '⚠️'}
                              {alert.type === 'fire' && '🔥'}
                              {alert.type === 'police' && '🚔'}
                              {alert.type === 'other' && '🚨'}
                            </span>
                            <h4 className="font-medium text-gray-900">
                              {emergencyTypeLabels[alert.type]}
                            </h4>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${priorityColors[alert.priority]}`}>
                              {alert.priority.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{alert.location.address}</span>
                            <Clock className="h-3 w-3 ml-3 mr-1" />
                            <span>{formatTimeAgo(alert.timestamp)}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[alert.status]}`}>
                          {alert.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Alert Details */}
          <div className="w-1/2 overflow-y-auto">
            {selectedAlert ? (
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">
                      {selectedAlert.type === 'medical' && '🏥'}
                      {selectedAlert.type === 'safety' && '⚠️'}
                      {selectedAlert.type === 'fire' && '🔥'}
                      {selectedAlert.type === 'police' && '🚔'}
                      {selectedAlert.type === 'other' && '🚨'}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {emergencyTypeLabels[selectedAlert.type]}
                      </h3>
                      <p className="text-gray-600">Alert ID: {selectedAlert.id}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[selectedAlert.priority]}`}>
                      {selectedAlert.priority.toUpperCase()} PRIORITY
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedAlert.status]}`}>
                      {selectedAlert.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700">{selectedAlert.message}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Location</p>
                        <p className="text-sm text-gray-600">{selectedAlert.location.address}</p>
                        <p className="text-xs text-gray-500">
                          {selectedAlert.location.latitude.toFixed(6)}, {selectedAlert.location.longitude.toFixed(6)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Reported</p>
                        <p className="text-sm text-gray-600">{formatTimeAgo(selectedAlert.timestamp)}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Nearby Users Notified</p>
                        <p className="text-sm text-gray-600">{selectedAlert.nearbyUsers.length} users</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Actions</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleUpdateStatus(selectedAlert.id, 'resolved')}
                        disabled={selectedAlert.status === 'resolved'}
                        className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Resolved
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedAlert.id, 'cancelled')}
                        disabled={selectedAlert.status === 'cancelled'}
                        className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel Alert
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Emergency
                      </button>
                      <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>Select an alert to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
