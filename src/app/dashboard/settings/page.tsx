import React from 'react';
import { UserCircle, Users, Link, RefreshCw, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <a href="#profile" className="border-b-2 border-blue-500 py-4 px-6 text-sm font-medium text-blue-600">
              <div className="flex items-center gap-2">
                <UserCircle size={18} />
                <span>Profile</span>
              </div>
            </a>
            <a href="#users" className="border-b-2 border-transparent hover:border-gray-300 py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700">
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>Users</span>
              </div>
            </a>
            <a href="#api" className="border-b-2 border-transparent hover:border-gray-300 py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700">
              <div className="flex items-center gap-2">
                <Link size={18} />
                <span>REST API Connect</span>
              </div>
            </a>
          </nav>
        </div>
        
        {/* Profile Section */}
        <div id="profile" className="p-6">
          <h3 className="text-lg font-semibold mb-4">Account Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="John"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="john.doe@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter current password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
        
        {/* Users Section (Hidden by default) */}
        <div id="users" className="hidden p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Users</h3>
            <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
              <Users size={16} />
              <span>Add New User</span>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">John Doe</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">john.doe@example.com</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Admin
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a href="#" className="text-blue-600 hover:text-blue-900 mr-4">Edit</a>
                    <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Jane Smith</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">jane.smith@example.com</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Cashier
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a href="#" className="text-blue-600 hover:text-blue-900 mr-4">Edit</a>
                    <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* API Connect Section (Hidden by default) */}
        <div id="api" className="hidden p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">WooCommerce REST API Connection</h3>
            <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              <RefreshCw size={16} />
              <span>Test Connection</span>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store URL
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://your-store.com"
                defaultValue={process.env.WOOCOMMERCE_URL}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consumer Key
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                defaultValue={process.env.WOOCOMMERCE_CONSUMER_KEY}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consumer Secret
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                defaultValue={process.env.WOOCOMMERCE_CONSUMER_SECRET}
              />
            </div>
            
            <div className="mt-6">
              <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                <Save size={16} />
                <span>Save API Settings</span>
              </button>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-2">Connection Status</h4>
            <div className="flex items-center text-green-600">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
              <span>Connected to WooCommerce API</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Last synced: March 14, 2025, 10:30 AM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
