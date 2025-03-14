"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Filter, Barcode, Plus, Minus, X, CreditCard } from 'lucide-react';
import { getProducts, Product } from '@/services/productService';
import { useCart } from '@/contexts/CartContext';
import { PLACEHOLDER_IMAGE } from '@/components/PlaceholderImage';
import { formatCurrency } from '@/lib/currency';

export default function SalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const { cartItems, addToCart, removeFromCart, updateQuantity, subtotal, total } = useCart();

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(
            data.flatMap(product => 
              product.categories?.map(cat => cat.name) || []
            )
          )
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      product.categories?.some(cat => cat.name === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleRemoveFromCart = (id: number) => {
    removeFromCart(id);
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    updateQuantity(id, quantity);
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden">
      {/* Products Section */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Sale</h2>
          <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            <Barcode size={16} />
            <span>Scan Barcode</span>
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <Filter size={16} />
                <span>Filter</span>
              </button>
              <select 
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
              <p className="mt-2 text-gray-500">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-40 relative">
                      <Image
                        src={product.images && product.images.length > 0 ? product.images[0].src : PLACEHOLDER_IMAGE}
                        alt={product.images && product.images.length > 0 ? product.images[0].alt : product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                      <div className="flex justify-between items-center">
                        <div>
                          {product.regular_price !== product.price ? (
                            <div>
                              <span className="text-sm line-through text-gray-400">{formatCurrency(parseFloat(product.regular_price))}</span>
                              <span className="text-lg font-bold text-gray-900 ml-2">{formatCurrency(parseFloat(product.price))}</span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">{formatCurrency(parseFloat(product.price))}</span>
                          )}
                          <div className="text-sm text-gray-500">
                            Stock: {product.stock_quantity}
                          </div>
                        </div>
                        <button 
                          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock_quantity <= 0}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500">No products found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Cart Section */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Cart</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 pb-4">
                  <div className="h-16 w-16 relative flex-shrink-0">
                    <Image
                      src={item.image || PLACEHOLDER_IMAGE}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.name}</h4>
                    <div className="text-sm text-gray-500">{formatCurrency(item.price)}</div>
                    <div className="flex items-center mt-2">
                      <button 
                        className="p-1 border border-gray-300 rounded-l-md hover:bg-gray-100"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 py-1 border-t border-b border-gray-300">{item.quantity}</span>
                      <button 
                        className="p-1 border border-gray-300 rounded-r-md hover:bg-gray-100"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                    <button 
                      className="text-red-500 hover:text-red-700 mt-2"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-center">Cart Empty</p>
              <p className="text-center text-sm mt-2">Scan a product barcode or add a product from the list</p>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 p-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal (excl.)</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-600 font-bold">Total</span>
            <span className="font-bold text-lg">{formatCurrency(total)}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50">
              Cancel
            </button>
            <button 
              className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              disabled={cartItems.length === 0}
            >
              <CreditCard size={16} />
              <span>Checkout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
