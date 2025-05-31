import { Alert, Box, Button, MenuItem, Select, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useClusterOps } from '../hooks/useClusterOps';

export const DetachForm: React.FC = () => {
  const [clusterName, setClusterName] = useState<string>('');
  const [clusters, setClusters] = useState<{ name: string; status: string }[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const { detachCluster, getClusterStatus, loading } = useClusterOps();

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const clusterList = await getClusterStatus();
        setClusters(clusterList);
      } catch (err) {
        setError('Failed to fetch cluster list');
      }
    };
    fetchClusters();
  }, [getClusterStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!clusterName) {
      setError('Cluster name is required');
      return;
    }

    try {
      const response = await detachCluster(clusterName);
      if (response.success) {
        setSuccess(response.message || 'Cluster detached successfully');
        setClusterName('');
        // Refresh cluster list
        const updatedClusters = await getClusterStatus();
        setClusters(updatedClusters);
      } else {
        setError(response.message || 'Failed to detach cluster');
      }
    } catch (err) {
      setError('An error occurred while detaching the cluster');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Detach Cluster
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Select
        label="Select Cluster"
        value={clusterName}
        onChange={(e) => setClusterName(e.target.value as string)}
        fullWidth
        margin="none"
        displayEmpty
        renderValue={(selected) => {
          if (!selected) {
            return <em>Select a cluster to detach</em>;
          }
          return selected;
        }}
      >
        <MenuItem disabled value="">
          <em>Select a cluster to detach</em>
        </MenuItem>
        {clusters.map((cluster) => (
          <MenuItem key={cluster.name} value={cluster.name}>
            {cluster.name} ({cluster.status})
          </MenuItem>
        ))}
      </Select>
      <Button
        type="submit"
        variant="contained"
        color="secondary"
        fullWidth
        disabled={loading || !clusterName}
        sx={{ mt: 2 }}
      >
        {loading ? 'Detaching...' : 'Detach Cluster'}
      </Button>
    </Box>
  );
};
