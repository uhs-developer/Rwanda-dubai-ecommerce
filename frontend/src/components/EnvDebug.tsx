import React from 'react';

export function EnvDebug() {
  const flutterwaveKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;
  
  return (
    <div className="p-4 border rounded bg-gray-100">
      <h3 className="font-bold mb-2">Environment Variables Debug</h3>
      <p><strong>VITE_FLUTTERWAVE_PUBLIC_KEY:</strong> {flutterwaveKey || 'NOT FOUND'}</p>
      <p><strong>Key length:</strong> {flutterwaveKey?.length || 0}</p>
      <p><strong>Starts with FLWPUBK:</strong> {flutterwaveKey?.startsWith('FLWPUBK') ? 'Yes' : 'No'}</p>
      <p><strong>Mode:</strong> {import.meta.env.MODE}</p>
      <p><strong>Dev:</strong> {import.meta.env.DEV ? 'Yes' : 'No'}</p>
    </div>
  );
}
