package handlers

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"strings"
	"time"

	// "strings"

	"net/http"

	"github.com/gin-gonic/gin"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
	clientcmdapi "k8s.io/client-go/tools/clientcmd/api"
	"k8s.io/klog/v2"
)

type ContextInfo struct {
	Name    string
	Cluster string
}

type ManagedClusterInfo struct {
	Name         string            `json:"name"`
	Labels       map[string]string `json:"labels"`
	CreationTime time.Time         `json:"creationTime"`
	Context      string            `json:"context,omitempty"`
}

// var mutex sync.Mutex

func GetAvailableClustersHandler(c *gin.Context) {
	available, err := GetAvailableClusters()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, available)
}

func GetAvailableClusters() ([]ContextInfo, error) {
	kubeconfig := kubeconfigPath()
	log.Printf("Using kubeconfig: %s", kubeconfig)

	config, err := clientcmd.LoadFromFile(kubeconfig)
	if err != nil {
		return nil, err
	}

	// Get managed clusters from OCM
	managedClusters, err := GetITSInfo()
	if err != nil {
		log.Printf("Error retrieving managed clusters: %v", err)
		managedClusters = make([]ManagedClusterInfo, 0)
	}

	// Build lookup map with multiple variations
	managedSet := make(map[string]bool)
	for _, mc := range managedClusters {
		baseName := strings.ToLower(mc.Name)
		managedSet[baseName] = true

		// Add common prefix variations to the managed set
		managedSet["k3d-"+baseName] = true
		managedSet["kind-"+baseName] = true
		managedSet[strings.ToLower(mc.Name+"-kubeflex")] = true
	}

	var available []ContextInfo
	for ctxName, ctx := range config.Contexts {
		lowerCtxName := strings.ToLower(ctxName)
		lowerCluster := strings.ToLower(ctx.Cluster)

		// Skip system contexts
		if strings.HasPrefix(lowerCtxName, "its") ||
			strings.HasPrefix(lowerCtxName, "wds") ||
			strings.HasPrefix(lowerCtxName, "ar") {
			continue
		}

		// Check all possible naming variations
		if managedSet[lowerCtxName] ||
			managedSet[lowerCluster] ||
			managedSet[strings.TrimPrefix(lowerCluster, "k3d-")] ||
			managedSet[strings.TrimPrefix(lowerCluster, "kind-")] {
			continue
		}

		available = append(available, ContextInfo{
			Name:    ctxName,
			Cluster: ctx.Cluster,
		})
	}

	return available, nil
}

// LoadFromFile takes a filename and deserializes the contents into Config object
func LoadFromFile(filename string) (*clientcmdapi.Config, error) {
	kubeconfigBytes, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	config, err := clientcmd.Load(kubeconfigBytes)
	if err != nil {
		return nil, err
	}
	klog.V(6).Infoln("Config loaded from file: ", filename)

	// set LocationOfOrigin on every Cluster, User, and Context
	for key, obj := range config.AuthInfos {
		obj.LocationOfOrigin = filename
		config.AuthInfos[key] = obj
	}
	for key, obj := range config.Clusters {
		obj.LocationOfOrigin = filename
		config.Clusters[key] = obj
	}
	for key, obj := range config.Contexts {
		obj.LocationOfOrigin = filename
		config.Contexts[key] = obj
	}

	if config.AuthInfos == nil {
		config.AuthInfos = map[string]*clientcmdapi.AuthInfo{}
	}
	if config.Clusters == nil {
		config.Clusters = map[string]*clientcmdapi.Cluster{}
	}
	if config.Contexts == nil {
		config.Contexts = map[string]*clientcmdapi.Context{}
	}

	return config, nil
}
func GetITSInfo() ([]ManagedClusterInfo, error) {
	kubeconfig := kubeconfigPath()
	config, err := clientcmd.LoadFromFile(kubeconfig)
	if err != nil {
		return nil, err
	}

	var managedClusters []ManagedClusterInfo

	// Check all contexts that might be hub clusters
	for contextName := range config.Contexts {
		if !strings.HasPrefix(contextName, "its") {
			continue
		}

		clientConfig := clientcmd.NewNonInteractiveClientConfig(
			*config,
			contextName,
			&clientcmd.ConfigOverrides{},
			nil,
		)

		restConfig, err := clientConfig.ClientConfig()
		if err != nil {
			log.Printf("Skipping context %s: %v", contextName, err)
			continue
		}

		clientset, err := kubernetes.NewForConfig(restConfig)
		if err != nil {
			log.Printf("Error creating clientset for %s: %v", contextName, err)
			continue
		}

		clustersBytes, err := clientset.RESTClient().Get().
			AbsPath("/apis/cluster.open-cluster-management.io/v1").
			Resource("managedclusters").
			DoRaw(context.TODO())

		if err != nil {
			log.Printf("Error fetching clusters from %s: %v", contextName, err)
			continue
		}

		var clusterList struct {
			Items []struct {
				Metadata struct {
					Name              string            `json:"name"`
					Labels            map[string]string `json:"labels"`
					CreationTimestamp string            `json:"creationTimestamp"`
				} `json:"metadata"`
			} `json:"items"`
		}

		if err := json.Unmarshal(clustersBytes, &clusterList); err != nil {
			log.Printf("Error unmarshaling clusters: %v", err)
			continue
		}

		for _, item := range clusterList.Items {
			creationTime, _ := time.Parse(time.RFC3339, item.Metadata.CreationTimestamp)
			managedClusters = append(managedClusters, ManagedClusterInfo{
				Name:         item.Metadata.Name,
				Labels:       item.Metadata.Labels,
				CreationTime: creationTime,
				Context:      contextName,
			})
		}
	}

	return managedClusters, nil
}
