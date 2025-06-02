import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [clusters, setClusters] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch the list of available clusters
    fetch('/api/available')
      .then((res) => res.json())
      .then((data) => setClusters(data))
      .catch((err) => {
        console.error('Error fetching clusters:', err);
        setMessage('Failed to load clusters.');
      });
  }, []);

  const handleOnboard = async () => {
    if (!selectedCluster) {
      setMessage('Please select a cluster to onboard.');
      return;
    }

    try {
      const response = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clusterName: selectedCluster }),
      });

      const result = await response.json();
      setMessage(result.message || 'Cluster onboarded successfully.');
    } catch (error) {
      console.error('Error onboarding cluster:', error);
      setMessage('Failed to onboard cluster.');
    }
  };

  const handleDetach = async () => {
    if (!selectedCluster) {
      setMessage('Please select a cluster to detach.');
      return;
    }

    try {
      const response = await fetch('/api/detach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clusterName: selectedCluster }),
      });

      const result = await response.json();
      setMessage(result.message || 'Cluster detached successfully.');
    } catch (error) {
      console.error('Error detaching cluster:', error);
      setMessage('Failed to detach cluster.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Cluster Management</h2>

      <div className="mb-4">
        <label htmlFor="cluster-select" className="block mb-2">
          Select a cluster:
        </label>
        <select
          id="cluster-select"
          value={selectedCluster}
          onChange={(e) => setSelectedCluster(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">-- Choose a cluster --</option>
          {clusters.map((cluster) => (
            <option key={cluster.Name} value={cluster.Name}>
              {cluster.Name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleOnboard}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Onboard Cluster
        </button>
        <button
          onClick={handleDetach}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Detach Cluster
        </button>
      </div>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
