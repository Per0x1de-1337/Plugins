package main

import (
	"backend/handlers"

	"github.com/Per0x1de-1337/pluginapi"

	"github.com/gin-gonic/gin"
)

// Ensure *Plugin implements pluginapi.KubestellarPlugin
var _ pluginapi.KubestellarPlugin = (*Plugin)(nil)

// Plugin represents the KubeStellar cluster management plugin
type Plugin struct {
	router   *gin.Engine
	metadata pluginapi.PluginMetadata
	handlers map[string]gin.HandlerFunc
}

// NewPlugin creates a new instance of the plugin
func NewPlugin() pluginapi.KubestellarPlugin {
	return &Plugin{
		router: gin.Default(),
		metadata: pluginapi.PluginMetadata{
			ID:          "kubestellar-cluster-plugin",
			Name:        "KubeStellar Cluster Management",
			Version:     "1.0.0",
			Description: "Plugin for cluster onboarding and detachment in KubeStellar",
			Author:      "Peroxide",
		},
		handlers: map[string]gin.HandlerFunc{
			"/onboard":   handlers.OnboardClusterHandler,
			"/detach":    handlers.DetachClusterHandler,
			"/status":    handlers.GetClusterStatusHandler,
			"/available": handlers.GetAvailableClustersHandler,
		},
	}
}

// Initialize sets up the plugin with the provided configuration
func (p *Plugin) Initialize(config map[string]interface{}) error {
	// Register routes for cluster operations using the router
	// This is for internal use if needed, but handlers are also provided via GetHandlers
	p.router.POST("/onboard", p.handlers["/onboard"])
	p.router.POST("/detach", p.handlers["/detach"])
	p.router.GET("/status", p.handlers["/status"])
	p.router.GET("/available", p.handlers["/available"])
	// Configuration can be processed here if needed (e.g., API keys, cluster settings)
	return nil
}

// GetMetadata returns the plugin's metadata
func (p *Plugin) GetMetadata() pluginapi.PluginMetadata {
	return p.metadata
}

// GetHandlers returns the registered handlers for dynamic route injection
func (p *Plugin) GetHandlers() map[string]gin.HandlerFunc {
	return p.handlers
}

// Health checks the plugin's operational status
func (p *Plugin) Health() error {
	// Simple health check; can be expanded with actual checks (e.g., connectivity to clusters)
	return nil
}

// Cleanup performs resource cleanup during plugin uninstallation
func (p *Plugin) Cleanup() error {
	// Placeholder for cleanup logic (e.g., unregister resources, clear caches)
	return nil
}
