import React from 'react';

export default function ClusterTable({ clusters }) {
  if (!clusters.length) return <p>No clusters found.</p>;

  return (
    <table className="w-full table-auto border border-gray-200">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2 text-left">Cluster Name</th>
          <th className="px-4 py-2 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {clusters.map((c, i) => (
          <tr key={i} className="border-t">
            <td className="px-4 py-2">{c.clusterName}</td>
            <td className="px-4 py-2">{c.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
