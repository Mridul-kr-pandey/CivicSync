// Alert Service for SOS functionality
export interface SOSAlertData {
  id: string
  type: 'medical' | 'safety' | 'fire' | 'police' | 'other'
  location: {
    latitude: number
    longitude: number
    address: string
  }
  message: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  timestamp: number
  senderId: string
  senderName: string
  status: 'active' | 'resolved' | 'cancelled'
  nearbyUsers: string[]
}

export interface NearbyUser {
  id: string
  name: string
  location: {
    latitude: number
    longitude: number
  }
  distance: number
  lastSeen: number
  isOnline: boolean
}

class AlertService {
  private alerts: SOSAlertData[] = []
  private nearbyUsers: NearbyUser[] = []
  private listeners: ((alerts: SOSAlertData[]) => void)[] = []
  private nearbyUsersListeners: ((users: NearbyUser[]) => void)[] = []

  // Calculate distance between two coordinates (in kilometers)
  private calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180)
  }

  // Find nearby users within specified radius (in kilometers)
  async findNearbyUsers(
    userLocation: { latitude: number; longitude: number },
    radiusKm: number = 5
  ): Promise<NearbyUser[]> {
    try {
      // In a real implementation, this would query a database or API
      // For now, we'll simulate with mock data
      const mockUsers: Omit<NearbyUser, 'distance'>[] = [
        {
          id: 'user1',
          name: 'John Doe',
          location: {
            latitude: userLocation.latitude + 0.001,
            longitude: userLocation.longitude + 0.001
          },
          lastSeen: Date.now() - 300000, // 5 minutes ago
          isOnline: true
        },
        {
          id: 'user2',
          name: 'Jane Smith',
          location: {
            latitude: userLocation.latitude - 0.002,
            longitude: userLocation.longitude + 0.001
          },
          lastSeen: Date.now() - 600000, // 10 minutes ago
          isOnline: true
        },
        {
          id: 'user3',
          name: 'Mike Johnson',
          location: {
            latitude: userLocation.latitude + 0.003,
            longitude: userLocation.longitude - 0.002
          },
          lastSeen: Date.now() - 1200000, // 20 minutes ago
          isOnline: false
        }
      ]

      const nearbyUsers: NearbyUser[] = mockUsers
        .map(user => ({
          ...user,
          distance: this.calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            user.location.latitude,
            user.location.longitude
          )
        }))
        .filter(user => user.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance)

      this.nearbyUsers = nearbyUsers
      this.notifyNearbyUsersListeners()
      
      return nearbyUsers
    } catch (error) {
      console.error('Error finding nearby users:', error)
      return []
    }
  }

  // Send SOS alert to nearby users
  async sendSOSAlert(alertData: Omit<SOSAlertData, 'id' | 'nearbyUsers' | 'status'>): Promise<SOSAlertData> {
    try {
      // Find nearby users
      const nearbyUsers = await this.findNearbyUsers(alertData.location, 5)
      
      // Create alert with unique ID
      const alert: SOSAlertData = {
        ...alertData,
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        nearbyUsers: nearbyUsers.map(user => user.id),
        status: 'active'
      }

      // Add to alerts list
      this.alerts.unshift(alert)
      
      // Notify listeners
      this.notifyListeners()

      // In a real implementation, this would:
      // 1. Send push notifications to nearby users
      // 2. Send SMS/WhatsApp messages
      // 3. Notify emergency services
      // 4. Store in database
      
      console.log('SOS Alert sent:', alert)
      console.log('Notifying nearby users:', nearbyUsers.map(u => u.name))

      // Simulate real-time notifications
      this.simulateRealTimeNotifications(alert, nearbyUsers)

      return alert
    } catch (error) {
      console.error('Error sending SOS alert:', error)
      throw error
    }
  }

  // Simulate real-time notifications (in real app, this would use WebSockets, push notifications, etc.)
  private simulateRealTimeNotifications(alert: SOSAlertData, nearbyUsers: NearbyUser[]) {
    // Simulate notifications being sent
    setTimeout(() => {
      console.log(`📱 Push notification sent to ${nearbyUsers.length} nearby users`)
      console.log(`📧 SMS sent to emergency contacts`)
      console.log(`🚨 Alert broadcasted to local emergency services`)
    }, 1000)
  }

  // Get all alerts
  getAlerts(): SOSAlertData[] {
    return [...this.alerts]
  }

  // Get nearby users
  getNearbyUsers(): NearbyUser[] {
    return [...this.nearbyUsers]
  }

  // Update alert status
  updateAlertStatus(alertId: string, status: 'active' | 'resolved' | 'cancelled'): boolean {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.status = status
      this.notifyListeners()
      return true
    }
    return false
  }

  // Subscribe to alerts updates
  subscribeToAlerts(callback: (alerts: SOSAlertData[]) => void): () => void {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  // Subscribe to nearby users updates
  subscribeToNearbyUsers(callback: (users: NearbyUser[]) => void): () => void {
    this.nearbyUsersListeners.push(callback)
    return () => {
      this.nearbyUsersListeners = this.nearbyUsersListeners.filter(listener => listener !== callback)
    }
  }

  // Notify listeners
  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.alerts))
  }

  private notifyNearbyUsersListeners() {
    this.nearbyUsersListeners.forEach(callback => callback(this.nearbyUsers))
  }

  // Get alerts by location (within radius)
  getAlertsNearby(
    location: { latitude: number; longitude: number },
    radiusKm: number = 10
  ): SOSAlertData[] {
    return this.alerts.filter(alert => {
      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        alert.location.latitude,
        alert.location.longitude
      )
      return distance <= radiusKm && alert.status === 'active'
    })
  }

  // Clear old alerts (older than 24 hours)
  clearOldAlerts() {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
    this.alerts = this.alerts.filter(alert => alert.timestamp > oneDayAgo)
    this.notifyListeners()
  }
}

// Export singleton instance
export const alertService = new AlertService()

// Auto-clear old alerts every hour
setInterval(() => {
  alertService.clearOldAlerts()
}, 60 * 60 * 1000)
