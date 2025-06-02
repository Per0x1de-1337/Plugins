import React, { useState } from 'react';

export default function DetachForm() {
  const [clusterName, setClusterName] = useState('');
  const [message, setMessage] = useState('');

  const submit = async e => {
    e.preventDefault();
    const res = await fetch('/detach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clusterName }),
    });

    const json = await res.json();
    setMessage(json.message || json.error);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <input type="text" placeholder="Cluster Name" value={clusterName} onChange={e => setClusterName(e.target.value)} className="border p-2 w-full" />
      <button className="bg-red-500 text-white px-4 py-2 rounded" type="submit">Detach</button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </form>
  );
}
