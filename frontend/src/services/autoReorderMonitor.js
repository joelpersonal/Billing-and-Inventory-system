import apiService from './api.js';

class AutoReorderMonitor {
  constructor() {
    this.isEnabled = false;
    this.checkInterval = null;
    this.listeners = [];
  }

  /**
   * Start monitoring for auto reorders
   * @param {Object} settings - Settings object with preferences
   */
  start(settings) {
    if (!settings?.preferences?.autoReorder) {
      this.stop();
      return;
    }

    if (this.isEnabled) {
      return; // Already running
    }

    this.isEnabled = true;
    console.log('🔄 Auto Reorder Monitor started');

    // Check immediately
    this.checkReorderTriggers();

    // Set up periodic checks every 30 seconds
    this.checkInterval = setInterval(() => {
      this.checkReorderTriggers();
    }, 30000);
  }

  /**
   * Stop monitoring
   */
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isEnabled = false;
    console.log('⏹️ Auto Reorder Monitor stopped');
  }

  /**
   * Check for reorder triggers
   */
  async checkReorderTriggers() {
    if (!this.isEnabled) return;

    try {
      const response = await apiService.checkAutoReorderTriggers();
      
      if (response.success && response.reordersCreated > 0) {
        console.log(`🔄 Auto reorders created: ${response.reordersCreated}`);
        
        // Notify all listeners
        this.notifyListeners({
          type: 'reorders_created',
          count: response.reordersCreated,
          reorders: response.reorders
        });
      }
    } catch (error) {
      console.error('Auto reorder check failed:', error);
    }
  }

  /**
   * Add event listener
   * @param {Function} callback - Callback function to call when events occur
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove event listener
   * @param {Function} callback - Callback function to remove
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  /**
   * Notify all listeners of an event
   * @param {Object} event - Event object
   */
  notifyListeners(event) {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in auto reorder listener:', error);
      }
    });
  }

  /**
   * Get current monitoring status
   */
  getStatus() {
    return {
      isEnabled: this.isEnabled,
      hasInterval: !!this.checkInterval,
      listenerCount: this.listeners.length
    };
  }

  /**
   * Force a manual check (useful for testing)
   */
  async forceCheck() {
    console.log('🔄 Forcing auto reorder check...');
    await this.checkReorderTriggers();
  }
}

// Create singleton instance
const autoReorderMonitor = new AutoReorderMonitor();

export default autoReorderMonitor;