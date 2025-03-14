import React from 'react';
import UserButtonClient from '@/components/auth/UserButtonClient';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="fixed h-screen">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden ml-24">
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Bansita POS</h1>
            <UserButtonClient afterSignOutUrl="/" />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
