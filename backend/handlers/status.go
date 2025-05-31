package handlers

import (
	"net/http"
	"sync"

	"backend/types"

	"github.com/gin-gonic/gin"
)

var mutex sync.Mutex

func GetClusterStatusHandler(c *gin.Context) {
	mutex.Lock()
	defer mutex.Unlock()

	var statuses []types.ClusterStatus
	for cluster, status := range clusterStatuses {
		statuses = append(statuses, types.ClusterStatus{
			ClusterName: cluster,
			Status:      status,
		})
	}

	c.JSON(http.StatusOK, statuses)
}
