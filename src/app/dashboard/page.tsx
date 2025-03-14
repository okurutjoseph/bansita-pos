"use client";

import React from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users,
  TrendingUp
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock data for the dashboard
const mockData = {
  totalSales: 15250.75,
  totalOrders: 124,
  totalProducts: 45,
  totalCustomers: 78,
  recentSales: [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
  ],
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  className?: string;
}

const StatCard = ({ title, value, icon: Icon, trend, className }: StatCardProps) => (
  <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        {trend && (
          <div className="flex items-center mt-2 text-green-500 text-sm">
            <TrendingUp size={16} className="mr-1" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className="bg-blue-100 p-3 rounded-full">
        <Icon className="h-6 w-6 text-blue-500" />
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Sales" 
            value={`$${mockData.totalSales.toLocaleString()}`} 
            icon={DollarSign} 
            trend="12% from last month"
          />
          <StatCard 
            title="Total Orders" 
            value={mockData.totalOrders} 
            icon={ShoppingCart} 
            trend="5% from last month"
          />
          <StatCard 
            title="Total Products" 
            value={mockData.totalProducts} 
            icon={Package} 
          />
          <StatCard 
            title="Total Customers" 
            value={mockData.totalCustomers} 
            icon={Users} 
            trend="8% from last month"
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockData.recentSales}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
