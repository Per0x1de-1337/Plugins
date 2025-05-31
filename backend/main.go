// package main

// import (
// 	"backend/handlers"
// 	"backend/pluginapi"

// 	"github.com/gin-gonic/gin"
// )

// // Ensure *Plugin implements pluginapi.KubestellarPlugin
// var _ pluginapi.KubestellarPlugin = (*Plugin)(nil)

// type Plugin struct {
// 	router   *gin.Engine
// 	metadata pluginapi.PluginMetadata
// 	handlers map[string]gin.HandlerFunc
// }

// func NewPlugin() pluginapi.KubestellarPlugin {
// 	return &Plugin{
// 		router: gin.Default(),
// 		metadata: pluginapi.PluginMetadata{
// 			ID:          "kubestellar-cluster-plugin",
// 			Name:        "KubeStellar Cluster Management",
// 			Version:     "1.0.0",
// 			Description: "Plugin for cluster onboarding and detachment in KubeStellar",
// 			Author:      "CNCF LFX Mentee",
// 		},
// 		handlers: map[string]gin.HandlerFunc{
// 			"/onboard": handlers.OnboardClusterHandler,
// 			"/detach":  handlers.DetachClusterHandler,
// 			"/status":  handlers.GetClusterStatusHandler,
// 		},
// 	}
// }

// // Implement all interface methods on *Plugin (Initialize, GetMetadata, etc.)
// func (p *Plugin) Initialize(config map[string]interface{}) error {
// 	// Register routes for cluster operations using the router
// 	// This is for internal use if needed, but handlers are also provided via GetHandlers
// 	p.router.POST("/onboard", p.handlers["/onboard"])
// 	p.router.POST("/detach", p.handlers["/detach"])
// 	p.router.GET("/status", p.handlers["/status"])
// 	// Configuration can be processed here if needed (e.g., API keys, cluster settings)
// 	return nil
// }

// func (p *Plugin) GetMetadata() pluginapi.PluginMetadata {
// 	return p.metadata
// }

// func (p *Plugin) GetHandlers() map[string]gin.HandlerFunc {
// 	return p.handlers
// }

// func (p *Plugin) Health() error {
// 	return nil
// }

// func (p *Plugin) Cleanup() error {
// 	return nil
// }

package main

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
)

// PluginMetadata holds metadata about the plugin
type PluginMetadata struct {
	ID          string
	Name        string
	Version     string
	Description string
	Author      string
}

// Plugin represents the KubeStellar cluster management plugin
type Plugin struct {
	router   *gin.Engine
	metadata PluginMetadata
	handlers map[string]gin.HandlerFunc
}

// NewPlugin creates a new instance of the plugin
func NewPlugin() interface{} {
	return &Plugin{
		router: gin.Default(),
		metadata: PluginMetadata{
			ID:          "kubestellar-cluster-plugin",
			Name:        "KubeStellar Cluster Management",
			Version:     "1.0.0",
			Description: "Plugin for cluster onboarding and detachment in KubeStellar",
			Author:      "CNCF LFX Mentee",
		},
		handlers: map[string]gin.HandlerFunc{
			"/onboard": handlers.OnboardClusterHandler,
			"/detach":  handlers.DetachClusterHandler,
			"/status":  handlers.GetClusterStatusHandler,
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
	// Configuration can be processed here if needed (e.g., API keys, cluster settings)
	return nil
}

// GetMetadata returns the plugin's metadata
func (p *Plugin) GetMetadata() PluginMetadata {
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
