import React from 'react';
import { Search, Plus, ChevronDown, Save } from 'lucide-react';

export default function NewOrderPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">New Order</h2>
        <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          <Save size={16} />
          <span>Save Order</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Customer</h3>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">or</span>
              <button className="flex items-center gap-1 text-blue-500 hover:text-blue-700">
                <Plus size={16} />
                <span>Create New Customer</span>
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-md p-4 mt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Customer Details</h4>
                <button className="text-blue-500 hover:text-blue-700 text-sm">Edit</button>
              </div>
              
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">No customer selected</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Items */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products to add..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <div className="border-t border-b border-gray-200 py-4">
              <div className="text-center text-gray-500 py-8">
                <p>No items added to this order yet</p>
                <p className="text-sm mt-2">Search for products above to add them to the order</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <div className="text-gray-600">Subtotal</div>
              <div className="font-medium">$0.00</div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-gray-600">Tax</div>
              <div className="font-medium">$0.00</div>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <div className="text-gray-800 font-bold">Total</div>
              <div className="text-xl font-bold">$0.00</div>
            </div>
          </div>
        </div>
        
        {/* Order Details */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Order Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="relative">
                <select className="appearance-none w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="pending">Pending payment</option>
                  <option value="processing">Processing</option>
                  <option value="on-hold">On hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                  <option value="failed">Failed</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <div className="relative">
                <select className="appearance-none w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="cash">Cash</option>
                  <option value="card">Credit Card</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note
              </label>
              <textarea
                rows={3}
                placeholder="Add a note to this order..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Shipping Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Shipping Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State / Province
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <div className="relative">
                <select className="appearance-none w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
