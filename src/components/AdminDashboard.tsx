import React from 'react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="bg-zinc-900 rounded-lg p-8 text-center border border-zinc-800">
          <p className="text-zinc-400">Admin features are currently unavailable.</p>
        </div>
      </div>
    </div>
  );
};
