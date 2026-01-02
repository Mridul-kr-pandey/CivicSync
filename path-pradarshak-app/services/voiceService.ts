// Voice Recognition Service for CivicSync
export interface VoiceCommand {
  action: string
  confidence: number
  transcript: string
  timestamp: number
}

export interface VoiceSettings {
  language: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  timeout: number
}

export type VoiceAction =
  | 'capture_photo'
  | 'sos_alert'
  | 'report_issue'
  | 'open_camera'
  | 'open_issues'
  | 'open_community'
  | 'open_profile'
  | 'help'
  | 'cancel'
  | 'unknown'

class VoiceService {
  private recognition: any | null = null
  private isListening = false
  private isSupported = false
  private settings: VoiceSettings = {
    language: 'en-US',
    continuous: false,
    interimResults: false,
    maxAlternatives: 1,
    timeout: 5000
  }
  private listeners: ((command: VoiceCommand) => void)[] = []
  private errorListeners: ((error: string) => void)[] = []
  private statusListeners: ((isListening: boolean) => void)[] = []

  constructor() {
    this.initializeRecognition()
  }

  private initializeRecognition() {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      this.isSupported = false
      console.warn('Speech recognition not supported in this browser')
      return
    }

    this.isSupported = true
    this.recognition = new SpeechRecognition()
    this.setupRecognition()
  }

  private setupRecognition() {
    if (!this.recognition) return

    this.recognition.continuous = this.settings.continuous
    this.recognition.interimResults = this.settings.interimResults
    this.recognition.lang = this.settings.language
    this.recognition.maxAlternatives = this.settings.maxAlternatives

    this.recognition.onstart = () => {
      this.isListening = true
      this.notifyStatusListeners(true)
    }

    this.recognition.onend = () => {
      this.isListening = false
      this.notifyStatusListeners(false)
    }

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1]
      const transcript = result[0].transcript.toLowerCase().trim()
      const confidence = result[0].confidence

      const command = this.processVoiceCommand(transcript, confidence)
      this.notifyListeners(command)
    }

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      this.isListening = false
      this.notifyStatusListeners(false)

      let errorMessage = 'Voice recognition error occurred'
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.'
          break
        case 'audio-capture':
          errorMessage = 'Microphone not accessible. Please check permissions.'
          break
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please enable microphone permissions.'
          break
        case 'network':
          errorMessage = 'Network error occurred during voice recognition.'
          break
        default:
          errorMessage = `Voice recognition error: ${event.error}`
      }

      this.notifyErrorListeners(errorMessage)
    }
  }

  private processVoiceCommand(transcript: string, confidence: number): VoiceCommand {
    const action = this.mapTranscriptToAction(transcript)

    return {
      action,
      confidence,
      transcript,
      timestamp: Date.now()
    }
  }

  private mapTranscriptToAction(transcript: string): VoiceAction {
    const commands = transcript.toLowerCase()

    // Camera and photo commands
    if (commands.includes('take photo') || commands.includes('capture photo') ||
      commands.includes('take picture') || commands.includes('capture picture') ||
      commands.includes('open camera') || commands.includes('camera')) {
      return 'capture_photo'
    }

    // SOS and emergency commands
    if (commands.includes('sos') || commands.includes('emergency') ||
      commands.includes('help me') || commands.includes('alert') ||
      commands.includes('emergency alert') || commands.includes('send sos')) {
      return 'sos_alert'
    }

    // Issue reporting commands
    if (commands.includes('report issue') || commands.includes('report problem') ||
      commands.includes('submit issue') || commands.includes('new issue')) {
      return 'report_issue'
    }

    // Navigation commands
    if (commands.includes('my issues') || commands.includes('view issues') ||
      commands.includes('show issues') || commands.includes('issues list')) {
      return 'open_issues'
    }

    if (commands.includes('community') || commands.includes('community issues') ||
      commands.includes('show community') || commands.includes('browse issues')) {
      return 'open_community'
    }

    if (commands.includes('profile') || commands.includes('my profile') ||
      commands.includes('user profile') || commands.includes('account')) {
      return 'open_profile'
    }

    // Help commands
    if (commands.includes('help') || commands.includes('what can you do') ||
      commands.includes('commands') || commands.includes('voice commands')) {
      return 'help'
    }

    // Cancel commands
    if (commands.includes('cancel') || commands.includes('stop') ||
      commands.includes('close') || commands.includes('exit')) {
      return 'cancel'
    }

    return 'unknown'
  }

  // Public methods
  startListening(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported) {
        reject(new Error('Speech recognition not supported'))
        return
      }

      if (!this.recognition) {
        reject(new Error('Speech recognition not initialized'))
        return
      }

      if (this.isListening) {
        resolve()
        return
      }

      try {
        this.recognition.start()
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
    }
  }

  isVoiceSupported(): boolean {
    return this.isSupported
  }

  isCurrentlyListening(): boolean {
    return this.isListening
  }

  updateSettings(newSettings: Partial<VoiceSettings>): void {
    this.settings = { ...this.settings, ...newSettings }
    if (this.recognition) {
      this.setupRecognition()
    }
  }

  getSettings(): VoiceSettings {
    return { ...this.settings }
  }

  // Event listeners
  onCommand(callback: (command: VoiceCommand) => void): () => void {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  onError(callback: (error: string) => void): () => void {
    this.errorListeners.push(callback)
    return () => {
      this.errorListeners = this.errorListeners.filter(listener => listener !== callback)
    }
  }

  onStatusChange(callback: (isListening: boolean) => void): () => void {
    this.statusListeners.push(callback)
    return () => {
      this.statusListeners = this.statusListeners.filter(listener => listener !== callback)
    }
  }

  private notifyListeners(command: VoiceCommand) {
    this.listeners.forEach(callback => callback(command))
  }

  private notifyErrorListeners(error: string) {
    this.errorListeners.forEach(callback => callback(error))
  }

  private notifyStatusListeners(isListening: boolean) {
    this.statusListeners.forEach(callback => callback(isListening))
  }

  // Voice feedback
  speak(text: string): void {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  // Get available voices
  getAvailableVoices(): SpeechSynthesisVoice[] {
    if ('speechSynthesis' in window) {
      return speechSynthesis.getVoices()
    }
    return []
  }

  // Set voice for speech synthesis
  setVoice(voice: SpeechSynthesisVoice | null): void {
    if ('speechSynthesis' in window && voice) {
      // Store voice preference in localStorage
      localStorage.setItem('civicSync_voice', voice.name)
    }
  }

  // Get stored voice preference
  getStoredVoice(): string | null {
    return localStorage.getItem('civicSync_voice')
  }
}

// Export singleton instance
export const voiceService = new VoiceService()

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}
