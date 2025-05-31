import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useClusterOps } from '../hooks/useClusterOps';

export const OnboardForm: React.FC = () => {
  const [clusterName, setClusterName] = useState<string>('');
  const [kubeconfig, setKubeconfig] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const { onboardCluster, loading } = useClusterOps();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!kubeconfig) {
      setError('Kubeconfig is required');
      return;
    }

    try {
      const response = await onboardCluster({ clusterName, kubeconfig });
      if (response.success) {
        setSuccess(response.message || 'Cluster onboarded successfully');
        setClusterName('');
        setKubeconfig('');
      } else {
        setError(response.message || 'Failed to onboard cluster');
      }
    } catch (err) {
      setError('An error occurred while onboarding the cluster');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Onboard New Cluster
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <TextField
        label="Cluster Name (Optional)"
        value={clusterName}
        onChange={(e) => setClusterName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Kubeconfig (Base64 Encoded)"
        value={kubeconfig}
        onChange={(e) => setKubeconfig(e.target.value)}
        fullWidth
        multiline
        rows={4}
        margin="normal"
        required
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Onboarding...' : 'Onboard Cluster'}
      </Button>
    </Box>
  );
};
