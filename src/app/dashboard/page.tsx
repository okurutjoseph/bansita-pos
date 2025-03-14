"use client";

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users,
  TrendingUp,
  RefreshCw
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
import { getOrders, getProducts, getCustomers } from '@/lib/api/woocommerce';

// Keeping sales mock data for now
const mockSalesData = {
  totalSales: 15250.75,
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
  isLoading?: boolean;
}

const StatCard = ({ title, value, icon: Icon, trend, className, isLoading = false }: StatCardProps) => (
  <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {isLoading ? (
          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
        ) : (
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        )}
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
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWooCommerceData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use the individual exported functions instead of methods on an object
      const [orders, products, customers] = await Promise.all([
        getOrders(),
        getProducts(),
        getCustomers(),
      ]);
      
      setDashboardData({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: customers.length,
      });
    } catch (err: unknown) {
      console.error('Error fetching dashboard data:', err);
      let errorMessage = 'Failed to load data from WooCommerce. Please check your API connection.';
      
      // Try to extract a more specific error message if available
      if (err && typeof err === 'object') {
        if ('response' in err && err.response && typeof err.response === 'object') {
          if ('status' in err.response && 'statusText' in err.response) {
            errorMessage += ` (${err.response.status}: ${err.response.statusText})`;
          }
        } else if ('message' in err && typeof err.message === 'string') {
          errorMessage += ` (${err.message})`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWooCommerceData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <div className="flex justify-between items-center">
              <p>{error}</p>
              <button 
                onClick={fetchWooCommerceData}
                className="flex items-center bg-red-200 hover:bg-red-300 rounded-md px-3 py-1 text-sm"
              >
                <RefreshCw size={14} className="mr-1" /> Retry
              </button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Sales" 
            value={`$${mockSalesData.totalSales.toLocaleString()}`} 
            icon={DollarSign} 
            trend="12% from last month"
          />
          <StatCard 
            title="Total Orders" 
            value={dashboardData.totalOrders} 
            icon={ShoppingCart} 
            trend="5% from last month"
            isLoading={isLoading}
          />
          <StatCard 
            title="Total Products" 
            value={dashboardData.totalProducts} 
            icon={Package} 
            isLoading={isLoading}
          />
          <StatCard 
            title="Total Customers" 
            value={dashboardData.totalCustomers} 
            icon={Users} 
            trend="8% from last month"
            isLoading={isLoading}
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockSalesData.recentSales}
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
