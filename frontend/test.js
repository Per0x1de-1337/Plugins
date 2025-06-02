// bundledPlugin.js (to be hosted at the specified URL)
(function() {
  // Define the plugin object
  const myPlugin = {
    name: "Test Plugin",
    version: "1.0.0",
    initialized: false,
    
    // Initialize the plugin
    init: function() {
      console.log("Test Plugin initialized!");
      this.initialized = true;
      return "Plugin initialization complete.";
    },
    
    // Sample function to demonstrate plugin functionality
    getGreeting: function(userName) {
      return `Hello, ${userName}! Welcome to the Test Plugin.`;
    },
    
    // Sample function to simulate rendering or updating UI
    updateUI: function(message) {
      console.log("Updating UI with message:", message);
      return `UI updated with: ${message}`;
    }
  };
  
  // Attach the plugin to the global window object
  window.myPlugin = myPlugin;
  console.log("Test Plugin script loaded and attached to window.myPlugin");
})();
