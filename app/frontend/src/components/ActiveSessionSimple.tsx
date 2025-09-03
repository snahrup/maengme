import React from 'react';

export const ActiveSessionSimple: React.FC<{ preset: any }> = ({ preset }) => {
  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-3xl mb-4">Session Active!</h1>
        <p>Product: {preset?.product?.name || 'Unknown'}</p>
        <p>Dose: {preset?.dose || 0}</p>
        <p className="mt-8">If you can see this, the routing works!</p>
      </div>
    </div>
  );
};