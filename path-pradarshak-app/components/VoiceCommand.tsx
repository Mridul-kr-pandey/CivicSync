'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  HelpCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { voiceService } from '@/services/voiceService'
import { voiceCommandProcessor } from '@/services/voiceCommandProcessor'

interface VoiceCommandProps {
  onCommand?: (action: string, command: any) => void
  className?: string
}

interface VoiceSettings {
  enableFeedback: boolean
  enableConfirmation: boolean
  language: string
  timeout: number
}

export default function VoiceCommand({ onCommand, className = '' }: VoiceCommandProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [lastCommand, setLastCommand] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState<VoiceSettings>({
    enableFeedback: true,
    enableConfirmation: true,
    language: 'en-US',
    timeout: 5000
  })
  const [pendingConfirmation, setPendingConfirmation] = useState<any>(null)

  const micButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Check if voice recognition is supported
    setIsSupported(voiceService.isVoiceSupported())

    // Load saved settings
    const savedSettings = localStorage.getItem('civicSync_voiceSettings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
        voiceCommandProcessor.updateConfig(parsed)
      } catch (error) {
        console.error('Error loading voice settings:', error)
      }
    }

    // Subscribe to voice service events
    const unsubscribeStatus = voiceService.onStatusChange((listening) => {
      setIsListening(listening)
      setIsProcessing(false)
    })

    const unsubscribeError = voiceService.onError((error) => {
      setError(error)
      setIsProcessing(false)
      setTimeout(() => setError(null), 5000)
    })

    const unsubscribeCommand = voiceService.onCommand((command) => {
      setLastCommand(command.transcript)
      setIsProcessing(true)
    })

    // Listen for voice command events
    const handleVoiceCommand = (event: CustomEvent) => {
      const { action, command } = event.detail
      if (onCommand) {
        onCommand(action, command)
      }
    }

    window.addEventListener('voiceCommand', handleVoiceCommand as EventListener)

    return () => {
      unsubscribeStatus()
      unsubscribeError()
      unsubscribeCommand()
      window.removeEventListener('voiceCommand', handleVoiceCommand as EventListener)
    }
  }, [onCommand])

  useEffect(() => {
    // Check for pending confirmation
    const checkConfirmation = () => {
      if (voiceCommandProcessor.hasPendingConfirmation()) {
        const pending = voiceCommandProcessor.getPendingConfirmation()
        setPendingConfirmation(pending)
      } else {
        setPendingConfirmation(null)
      }
    }

    const interval = setInterval(checkConfirmation, 100)
    return () => clearInterval(interval)
  }, [])

  const handleMicClick = async () => {
    if (isListening) {
      voiceService.stopListening()
    } else {
      try {
        setError(null)
        await voiceService.startListening()
      } catch (error) {
        console.error('Error starting voice recognition:', error)
        setError('Failed to start voice recognition. Please check microphone permissions.')
      }
    }
  }

  const handleToggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted) {
      voiceService.speak('Voice feedback muted')
    } else {
      voiceService.speak('Voice feedback enabled')
    }
  }

  const handleSettingsChange = (newSettings: Partial<VoiceSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    
    // Save to localStorage
    localStorage.setItem('civicSync_voiceSettings', JSON.stringify(updatedSettings))
    
    // Update voice service and processor
    voiceService.updateSettings({
      language: updatedSettings.language,
      timeout: updatedSettings.timeout
    })
    voiceCommandProcessor.updateConfig({
      enableFeedback: updatedSettings.enableFeedback,
      enableConfirmation: updatedSettings.enableConfirmation,
      confirmationTimeout: updatedSettings.timeout
    })
  }

  const handleConfirmation = (response: 'yes' | 'no') => {
    voiceCommandProcessor.handleConfirmationResponse(response)
    setPendingConfirmation(null)
  }

  const getMicButtonClass = () => {
    if (isProcessing) return 'animate-pulse'
    if (isListening) return 'animate-pulse bg-red-500 hover:bg-red-600'
    if (error) return 'bg-red-500 hover:bg-red-600'
    return 'bg-blue-500 hover:bg-blue-600'
  }

  const getMicIcon = () => {
    if (isProcessing) return <Loader2 className="h-6 w-6 animate-spin" />
    if (isListening) return <Mic className="h-6 w-6" />
    return <MicOff className="h-6 w-6" />
  }

  if (!isSupported) {
    return (
      <div className={`flex items-center justify-center p-4 bg-gray-100 rounded-lg ${className}`}>
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <span className="text-sm text-gray-600">Voice commands not supported in this browser</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Voice Command Interface */}
      <div className="flex items-center space-x-2">
        {/* Microphone Button */}
        <button
          ref={micButtonRef}
          onClick={handleMicClick}
          disabled={isProcessing}
          className={`p-3 rounded-full text-white transition-all duration-200 ${getMicButtonClass()} ${
            isProcessing ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
          title={isListening ? 'Stop listening' : 'Start voice command'}
        >
          {getMicIcon()}
        </button>

        {/* Status Indicator */}
        <div className="flex items-center space-x-2">
          {isListening && (
            <div className="flex items-center text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              Listening...
            </div>
          )}
          
          {isProcessing && (
            <div className="flex items-center text-sm text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </div>
          )}

          {error && (
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {error}
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-full transition-colors ${
              isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={isMuted ? 'Enable voice feedback' : 'Mute voice feedback'}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            title="Voice settings"
          >
            <Settings className="h-4 w-4" />
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            title="Voice commands help"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Last Command Display */}
      {lastCommand && (
        <div className="mt-2 p-2 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Last command:</span> "{lastCommand}"
          </p>
        </div>
      )}

      {/* Confirmation Dialog */}
      {pendingConfirmation && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-80">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Confirm Action</h3>
              <p className="text-sm text-gray-600 mb-3">
                You said: "{pendingConfirmation.transcript}"
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to {pendingConfirmation.action.replace('_', ' ')}?
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleConfirmation('yes')}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleConfirmation('no')}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Voice Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.enableFeedback}
                      onChange={(e) => handleSettingsChange({ enableFeedback: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Enable voice feedback</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.enableConfirmation}
                      onChange={(e) => handleSettingsChange({ enableConfirmation: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Require confirmation for critical actions</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingsChange({ language: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en-US">English (US)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="es-ES">Spanish</option>
                    <option value="fr-FR">French</option>
                    <option value="de-DE">German</option>
                    <option value="hi-IN">Hindi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmation Timeout (seconds)
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="30"
                    value={settings.timeout / 1000}
                    onChange={(e) => handleSettingsChange({ timeout: parseInt(e.target.value) * 1000 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Voice Commands</h2>
              
              <div className="space-y-4">
                {voiceCommandProcessor.getAvailableCommands().map((command) => (
                  <div key={command.action} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {command.description}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Examples:</span> {command.examples.join(', ')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Tips:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Speak clearly and at a normal pace</li>
                  <li>• Wait for the confirmation before speaking again</li>
                  <li>• Use natural language - you don't need exact phrases</li>
                  <li>• Critical actions like SOS alerts require confirmation</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowHelp(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
