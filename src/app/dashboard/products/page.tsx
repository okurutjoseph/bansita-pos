"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, ChevronLeft, ChevronRight, MoreHorizontal, Plus, X, Tag, Package, Save } from 'lucide-react';
import { getProducts, getProduct, Product } from '@/services/productService';
import { PLACEHOLDER_IMAGE } from '@/components/PlaceholderImage';
import { formatCurrency } from '@/lib/currency';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const params = {
          page,
          per_page: perPage,
          search: searchTerm,
        };
        const data = await getProducts(params);
        setProducts(data);
        
        // In a real app, you'd get the total pages from the API headers
        // This is a simplified calculation
        setTotalPages(Math.ceil(data.length / perPage));
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [page, perPage, searchTerm]);

  useEffect(() => {
    // Reset edited product when selected product changes
    if (selectedProduct) {
      setEditedProduct({
        ...selectedProduct
      });
    } else {
      setEditedProduct({});
    }
  }, [selectedProduct]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
  };

  const handleSelectProduct = async (product: Product) => {
    try {
      setDetailsLoading(true);
      // If we already have all the product details, just set it
      if (product.description) {
        setSelectedProduct(product);
      } else {
        // Otherwise, fetch the full product details
        const fullProduct = await getProduct(product.id);
        if (fullProduct) {
          setSelectedProduct(fullProduct);
        } else {
          setSelectedProduct(product);
        }
      }
    } catch (error) {
      console.error('Failed to load product details:', error);
      setSelectedProduct(product);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
    setEditedProduct({});
  };

  const handleInputChange = (field: keyof Product, value: string | number) => {
    setEditedProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct || !editedProduct) return;
    
    try {
      setUpdating(true);
      
      // Here you would implement the API call to update the product in WooCommerce
      // For example:
      // const updatedProduct = await updateProduct(selectedProduct.id, editedProduct);
      
      // For now, we'll just simulate a successful update
      console.log('Product update data:', editedProduct);
      
      // Update the product in the local state
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === selectedProduct.id ? { ...p, ...editedProduct } : p
        )
      );
      
      // Update the selected product
      setSelectedProduct(prev => prev ? { ...prev, ...editedProduct } : null);
      
      // Show success message (you could implement a toast notification here)
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Failed to update product. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden">
      {/* Products List Section */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Products</h2>
          <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <form onSubmit={handleSearch} className="flex gap-4">
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
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Search
              </button>
            </form>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                <p className="mt-2 text-gray-500">Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categories
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr 
                      key={product.id} 
                      className={`hover:bg-gray-50 cursor-pointer ${selectedProduct?.id === product.id ? 'bg-blue-50' : ''}`} 
                      onClick={() => handleSelectProduct(product)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 relative flex-shrink-0">
                            <Image
                              src={product.images && product.images.length > 0 ? product.images[0].src : PLACEHOLDER_IMAGE}
                              alt={product.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.sku || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.regular_price !== product.price ? (
                          <div>
                            <span className="text-sm line-through text-gray-400">{formatCurrency(product.regular_price)}</span>
                            <span className="text-sm font-medium text-gray-900 ml-2">{formatCurrency(product.price)}</span>
                          </div>
                        ) : (
                          <div className="text-sm font-medium text-gray-900">{formatCurrency(product.price)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.stock_quantity !== null && product.stock_quantity !== undefined
                            ? product.stock_quantity
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.categories && product.categories.length > 0
                            ? product.categories.map(cat => cat.name).join(', ')
                            : 'Uncategorized'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-gray-400 hover:text-gray-500" onClick={(e) => {
                          e.stopPropagation();
                          handleSelectProduct(product);
                        }}>
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No products found.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {products.length > 0 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center">
                    <ChevronLeft size={16} className="mr-1" />
                    Previous
                  </div>
                </button>
                <div className="text-sm text-gray-500 self-center">
                  Page {page} of {totalPages}
                </div>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center">
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Product Details Section - Always visible */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {selectedProduct ? 'Product Details' : 'SELECT PRODUCT'}
          </h3>
          {selectedProduct && (
            <button 
              onClick={handleCloseDetails}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {detailsLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            </div>
          ) : selectedProduct ? (
            <div className="space-y-6">
              {/* Product Image */}
              <div className="h-64 relative rounded-lg overflow-hidden">
                <Image
                  src={selectedProduct.images && selectedProduct.images.length > 0 
                    ? selectedProduct.images[0].src 
                    : PLACEHOLDER_IMAGE}
                  alt={selectedProduct.name}
                  fill
                  className="object-contain"
                />
              </div>
              
              {/* Product Name and Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={editedProduct.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">UGX</span>
                      <input
                        type="text"
                        value={editedProduct.regular_price || ''}
                        onChange={(e) => handleInputChange('regular_price', e.target.value)}
                        className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">UGX</span>
                      <input
                        type="text"
                        value={editedProduct.price || ''}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Product Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={editedProduct.sku || ''}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editedProduct.stock_quantity || 0}
                    onChange={(e) => handleInputChange('stock_quantity', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* Categories */}
              {selectedProduct.categories && selectedProduct.categories.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.categories.map((category, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Description */}
              {selectedProduct.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editedProduct.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-500">Select a product from the list to view its summary</p>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 p-4">
          {selectedProduct ? (
            <button 
              className="w-full flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handleUpdateProduct}
              disabled={updating}
            >
              {updating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Update Product</span>
                </>
              )}
            </button>
          ) : (
            <button 
              className="w-full flex items-center justify-center gap-2 bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed"
              disabled
            >
              <Save size={16} />
              <span>Update Product</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 