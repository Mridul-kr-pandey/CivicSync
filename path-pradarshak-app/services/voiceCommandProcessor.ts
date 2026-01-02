// Voice Command Processor for CivicSync
import { voiceService, VoiceCommand, VoiceAction } from './voiceService'

export interface VoiceCommandHandler {
  action: VoiceAction
  handler: (command: VoiceCommand) => void
  description: string
  examples: string[]
}

export interface VoiceCommandProcessorConfig {
  enableFeedback: boolean
  enableConfirmation: boolean
  confirmationTimeout: number
}

class VoiceCommandProcessor {
  private handlers: Map<VoiceAction, VoiceCommandHandler> = new Map()
  private config: VoiceCommandProcessorConfig = {
    enableFeedback: true,
    enableConfirmation: true,
    confirmationTimeout: 3000
  }
  private pendingConfirmation: VoiceCommand | null = null
  private confirmationTimeout: NodeJS.Timeout | null = null

  constructor() {
    this.setupDefaultHandlers()
    this.subscribeToVoiceCommands()
  }

  private setupDefaultHandlers() {
    // Capture Photo Handler
    this.registerHandler({
      action: 'capture_photo',
      description: 'Take a photo using the camera',
      examples: ['take photo', 'capture photo', 'open camera', 'camera'],
      handler: (command) => this.handleCapturePhoto(command)
    })

    // SOS Alert Handler
    this.registerHandler({
      action: 'sos_alert',
      description: 'Send emergency SOS alert',
      examples: ['sos', 'emergency', 'help me', 'send alert'],
      handler: (command) => this.handleSOSAlert(command)
    })

    // Report Issue Handler
    this.registerHandler({
      action: 'report_issue',
      description: 'Open issue reporting form',
      examples: ['report issue', 'submit issue', 'new issue'],
      handler: (command) => this.handleReportIssue(command)
    })

    // Open Issues Handler
    this.registerHandler({
      action: 'open_issues',
      description: 'View my reported issues',
      examples: ['my issues', 'view issues', 'show issues'],
      handler: (command) => this.handleOpenIssues(command)
    })

    // Open Community Handler
    this.registerHandler({
      action: 'open_community',
      description: 'Browse community issues',
      examples: ['community', 'community issues', 'browse issues'],
      handler: (command) => this.handleOpenCommunity(command)
    })

    // Open Profile Handler
    this.registerHandler({
      action: 'open_profile',
      description: 'Open user profile',
      examples: ['profile', 'my profile', 'account'],
      handler: (command) => this.handleOpenProfile(command)
    })

    // Help Handler
    this.registerHandler({
      action: 'help',
      description: 'Show available voice commands',
      examples: ['help', 'what can you do', 'commands'],
      handler: (command) => this.handleHelp(command)
    })

    // Cancel Handler
    this.registerHandler({
      action: 'cancel',
      description: 'Cancel current operation',
      examples: ['cancel', 'stop', 'close', 'exit'],
      handler: (command) => this.handleCancel(command)
    })
  }

  private subscribeToVoiceCommands() {
    voiceService.onCommand((command) => {
      this.processCommand(command)
    })
  }

  private processCommand(command: VoiceCommand) {
    console.log('Voice command received:', command)

    // Handle unknown commands
    if (command.action === 'unknown') {
      this.handleUnknownCommand(command)
      return
    }

    // Get handler for the command
    const handler = this.handlers.get(command.action as VoiceAction)
    if (!handler) {
      console.warn('No handler found for action:', command.action)
      return
    }

    // Check if confirmation is needed for critical actions
    if (this.requiresConfirmation(command.action as VoiceAction)) {
      this.requestConfirmation(command, handler)
    } else {
      this.executeCommand(command, handler)
    }
  }

  private requiresConfirmation(action: VoiceAction): boolean {
    const criticalActions: VoiceAction[] = ['sos_alert', 'capture_photo']
    return criticalActions.includes(action) && this.config.enableConfirmation
  }

  private requestConfirmation(command: VoiceCommand, handler: VoiceCommandHandler) {
    // Clear any existing confirmation
    this.clearConfirmation()

    this.pendingConfirmation = command

    // Provide voice feedback
    if (this.config.enableFeedback) {
      const confirmationText = this.getConfirmationText(command.action as VoiceAction)
      voiceService.speak(confirmationText)
    }

    // Set timeout for confirmation
    this.confirmationTimeout = setTimeout(() => {
      this.clearConfirmation()
      if (this.config.enableFeedback) {
        voiceService.speak('Command cancelled due to timeout')
      }
    }, this.config.confirmationTimeout)
  }

  private getConfirmationText(action: VoiceAction): string {
    switch (action) {
      case 'sos_alert':
        return 'Are you sure you want to send an emergency SOS alert? Say yes to confirm or no to cancel.'
      case 'capture_photo':
        return 'Are you sure you want to take a photo? Say yes to confirm or no to cancel.'
      default:
        return 'Please confirm this action by saying yes or no.'
    }
  }

  private executeCommand(command: VoiceCommand, handler: VoiceCommandHandler) {
    try {
      handler.handler(command)

      // Provide success feedback
      if (this.config.enableFeedback) {
        const successText = this.getSuccessText(command.action as VoiceAction)
        voiceService.speak(successText)
      }
    } catch (error) {
      console.error('Error executing voice command:', error)
      if (this.config.enableFeedback) {
        voiceService.speak('Sorry, there was an error executing that command')
      }
    }
  }

  private getSuccessText(action: VoiceAction): string {
    switch (action) {
      case 'capture_photo':
        return 'Opening camera to take photo'
      case 'sos_alert':
        return 'Sending emergency SOS alert'
      case 'report_issue':
        return 'Opening issue reporting form'
      case 'open_issues':
        return 'Opening your issues'
      case 'open_community':
        return 'Opening community issues'
      case 'open_profile':
        return 'Opening your profile'
      case 'help':
        return 'Here are the available voice commands'
      case 'cancel':
        return 'Operation cancelled'
      default:
        return 'Command executed successfully'
    }
  }

  private handleUnknownCommand(command: VoiceCommand) {
    console.log('Unknown voice command:', command.transcript)

    if (this.config.enableFeedback) {
      voiceService.speak('Sorry, I didn\'t understand that command. Say help to see available commands.')
    }
  }

  private clearConfirmation() {
    if (this.confirmationTimeout) {
      clearTimeout(this.confirmationTimeout)
      this.confirmationTimeout = null
    }
    this.pendingConfirmation = null
  }

  // Command handlers (these will be connected to actual app functions)
  private handleCapturePhoto(command: VoiceCommand) {
    // This will be connected to the camera component
    window.dispatchEvent(new CustomEvent('voiceCommand', {
      detail: { action: 'capture_photo', command }
    }))
  }

  private handleSOSAlert(command: VoiceCommand) {
    // This will be connected to the SOS component
    window.dispatchEvent(new CustomEvent('voiceCommand', {
      detail: { action: 'sos_alert', command }
    }))
  }

  private handleReportIssue(command: VoiceCommand) {
    // This will be connected to the issue reporting
    window.dispatchEvent(new CustomEvent('voiceCommand', {
      detail: { action: 'report_issue', command }
    }))
  }

  private handleOpenIssues(command: VoiceCommand) {
    // This will be connected to navigation
    window.dispatchEvent(new CustomEvent('voiceCommand', {
      detail: { action: 'open_issues', command }
    }))
  }

  private handleOpenCommunity(command: VoiceCommand) {
    // This will be connected to navigation
    window.dispatchEvent(new CustomEvent('voiceCommand', {
      detail: { action: 'open_community', command }
    }))
  }

  private handleOpenProfile(command: VoiceCommand) {
    // This will be connected to navigation
    window.dispatchEvent(new CustomEvent('voiceCommand', {
      detail: { action: 'open_profile', command }
    }))
  }

  private handleHelp(command: VoiceCommand) {
    // This will show help information
    window.dispatchEvent(new CustomEvent('voiceCommand', {
      detail: { action: 'help', command }
    }))
  }

  private handleCancel(command: VoiceCommand) {
    // This will cancel current operations
    this.clearConfirmation()
    window.dispatchEvent(new CustomEvent('voiceCommand', {
      detail: { action: 'cancel', command }
    }))
  }

  // Public methods
  registerHandler(handler: VoiceCommandHandler) {
    this.handlers.set(handler.action, handler)
  }

  unregisterHandler(action: VoiceAction) {
    this.handlers.delete(action)
  }

  getAvailableCommands(): VoiceCommandHandler[] {
    return Array.from(this.handlers.values())
  }

  updateConfig(newConfig: Partial<VoiceCommandProcessorConfig>) {
    this.config = { ...this.config, ...newConfig }
  }

  getConfig(): VoiceCommandProcessorConfig {
    return { ...this.config }
  }

  // Handle confirmation responses
  handleConfirmationResponse(response: 'yes' | 'no') {
    if (!this.pendingConfirmation) return

    this.clearConfirmation()

    if (response === 'yes') {
      const handler = this.handlers.get(this.pendingConfirmation.action as VoiceAction)
      if (handler) {
        this.executeCommand(this.pendingConfirmation, handler)
      }
    } else {
      if (this.config.enableFeedback) {
        voiceService.speak('Command cancelled')
      }
    }
  }

  // Check if there's a pending confirmation
  hasPendingConfirmation(): boolean {
    return this.pendingConfirmation !== null
  }

  getPendingConfirmation(): VoiceCommand | null {
    return this.pendingConfirmation
  }
}

// Export singleton instance
export const voiceCommandProcessor = new VoiceCommandProcessor()
