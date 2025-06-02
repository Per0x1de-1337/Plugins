import React, { useState } from 'react';

export default function OnboardForm() {
  const [clusterName, setClusterName] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const submit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', clusterName);
    if (file) formData.append('kubeconfig', file);

    const res = await fetch('/onboard', {
      method: 'POST',
      body: formData,
    });

    const json = await res.json();
    setMessage(json.message || json.error);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <input type="text" placeholder="Cluster Name" value={clusterName} onChange={e => setClusterName(e.target.value)} className="border p-2 w-full" />
      <input type="file" onChange={e => setFile(e.target.files[0])} className="border p-2 w-full" />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">Onboard</button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </form>
  );
}
