"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Search, Filter, Barcode, Plus, Minus, X, CreditCard, Loader2, Check, ChevronRight, RefreshCw } from 'lucide-react';
import { getProducts, prefetchProducts, Product } from '@/services/productService';
import { useCart } from '@/contexts/CartContext';
import { PLACEHOLDER_IMAGE } from '@/components/PlaceholderImage';
import { formatCurrency } from '@/lib/currency';
import { useRouter } from 'next/navigation';

interface Customer {
  id: number;
  name: string;
  username?: string;
  email: string;
  billingAddress: Address;
  shippingAddress: Address;
}

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export default function SalePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [checkoutInProgress, setCheckoutInProgress] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [showCheckoutSummary, setShowCheckoutSummary] = useState(false);
  const [customer, setCustomer] = useState("Guest Customer");
  const [orderDiscount, setOrderDiscount] = useState("0.00");
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [orderNote, setOrderNote] = useState("");
  const [sendNoteToCustomer, setSendNoteToCustomer] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState<Customer | null>(null);
  
  const { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    total, 
    isLoading,
    checkoutCart
  } = useCart();

  // Calculate tax (15%)
  const tax = subtotal * 0.15;
  const totalWithTax = subtotal + tax;

  // Mock customers data
  const [customers] = useState<Customer[]>([
    {
      id: 2,
      name: "John Smith",
      username: "tuveho",
      email: "john@example.com",
      billingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA"
      },
      shippingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA"
      }
    },
    {
      id: 5,
      name: "Susan Millar",
      username: "susan@example.com",
      email: "susan@example.com",
      billingAddress: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        postalCode: "90001",
        country: "USA"
      },
      shippingAddress: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        postalCode: "90001",
        country: "USA"
      }
    },
    {
      id: 4,
      name: "Thomas Margin",
      username: "thomas@example.com",
      email: "thomas@example.com",
      billingAddress: {
        street: "789 Pine Rd",
        city: "Chicago",
        state: "IL",
        postalCode: "60007",
        country: "USA"
      },
      shippingAddress: {
        street: "789 Pine Rd",
        city: "Chicago",
        state: "IL",
        postalCode: "60007",
        country: "USA"
      }
    }
  ]);

  // Load initial products
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getProducts({ per_page: 20, page: 1 });
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
        
        // Prefetch next page in the background
        prefetchProducts({ per_page: 20, page: 2 });
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Load more products when scrolling
  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;
    
    try {
      setLoading(true);
      const nextPage = page + 1;
      const newProducts = await getProducts({ per_page: 20, page: nextPage });
      
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
        setPage(nextPage);
        
        // Prefetch next page in the background
        prefetchProducts({ per_page: 20, page: nextPage + 1 });
      }
    } catch (error) {
      console.error('Failed to load more products:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  // Handle scroll event for infinite loading
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMoreProducts();
    }
  }, [loadMoreProducts]);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || 
        product.categories?.some(cat => cat.name === selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleAddToCart = useCallback((product: Product, e?: React.MouseEvent) => {
    // Add logging to debug the issue
    console.log('Adding product to cart:', product);
    if (e) e.stopPropagation(); // Prevent any parent click handlers
    
    // Add defensive checks
    if (!product || !product.id) {
      console.error('Invalid product:', product);
      return;
    }
    
    addToCart(product);
    console.log('Cart after adding:', cartItems);
  }, [addToCart, cartItems]);

  const handleRemoveFromCart = useCallback((id: number) => {
    removeFromCart(id);
  }, [removeFromCart]);

  const handleQuantityChange = useCallback((id: number, quantity: number) => {
    updateQuantity(id, quantity);
  }, [updateQuantity]);

  const handleShowCheckout = useCallback(() => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      return;
    }
    setShowCheckoutSummary(true);
  }, [cartItems.length]);

  const handleCloseCheckout = useCallback(() => {
    setShowCheckoutSummary(false);
  }, []);

  const handleCheckout = useCallback(async () => {
    if (cartItems.length === 0) return;
    
    setCheckoutInProgress(true);
    
    try {
      const success = await checkoutCart();
      
      if (success) {
        setCheckoutSuccess(true);
        
        // Redirect to orders page after successful checkout
        setTimeout(() => {
          router.push('/dashboard/orders');
        }, 2000);
      }
    } finally {
      if (!checkoutSuccess) {
        setCheckoutInProgress(false);
      }
    }
  }, [cartItems.length, checkoutCart, router, checkoutSuccess]);

  const handleAddCustomer = useCallback(() => {
    setShowCustomerModal(true);
  }, []);

  const handleAddDiscount = useCallback(() => {
    // This would typically open a modal or form to add a discount
    const discount = prompt("Enter discount amount:", orderDiscount);
    if (discount) {
      setOrderDiscount(discount);
    }
  }, [orderDiscount]);

  const handleAddCoupon = useCallback(() => {
    // This would typically open a modal or form to add a coupon
    const coupon = prompt("Enter coupon code:", couponCode);
    if (coupon) {
      setCouponCode(coupon);
    }
  }, [couponCode]);

  const handlePaymentMethodChange = useCallback(() => {
    // This would typically open a modal with payment options
    const paymentOptions = ["Cash on Delivery", "Pesapal"];
    const currentIndex = paymentOptions.indexOf(paymentMethod);
    const nextIndex = (currentIndex + 1) % paymentOptions.length;
    setPaymentMethod(paymentOptions[nextIndex]);
  }, [paymentMethod]);

  const handleSelectCustomer = useCallback((customer: Customer) => {
    setCustomer(customer.name);
    setSelectedCustomerDetails(customer);
    setShowCustomerModal(false);
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!customerSearchTerm) return customers;
    
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      (customer.username && customer.username.toLowerCase().includes(customerSearchTerm.toLowerCase()))
    );
  }, [customers, customerSearchTerm]);

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden">
      {/* Products Section */}
      <div className="flex-1 overflow-y-auto p-6" onScroll={handleScroll}>
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
          
          {loading && products.length === 0 ? (
            <div className="text-center py-10">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
              <p className="mt-2 text-gray-500">Loading products...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleAddToCart(product)}
                    >
                      <div className="h-40 relative">
                        <Image
                          src={product.images && product.images.length > 0 ? product.images[0].src : PLACEHOLDER_IMAGE}
                          alt={product.images && product.images.length > 0 ? product.images[0].alt : product.name}
                          fill
                          className="object-cover"
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                            className={`p-2 rounded-full ${
                              product.stock_quantity <= 0 
                                ? 'bg-gray-300 cursor-not-allowed' 
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation(); // Make sure this stops propagation
                              handleAddToCart(product, e);
                            }}
                            disabled={product.stock_quantity <= 0}
                            aria-label={`Add ${product.name} to cart`}
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
              
              {loading && products.length > 0 && (
                <div className="text-center py-4 mt-4">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                  <p className="mt-2 text-gray-500">Loading more products...</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Cart Section */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        {showCheckoutSummary ? (
          // Checkout Summary View
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-green-700 text-white">
              <h3 className="text-lg font-semibold">Sales Summary</h3>
              <button 
                onClick={handleCloseCheckout}
                className="text-white"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {/* Items Summary */}
              <div className="border-b border-gray-200">
                <div className="p-4 space-y-2">
                  {cartItems.map((item, index) => (
                    <div key={item.id} className="flex justify-between items-center py-2">
                      <div className="flex items-center">
                        <span className="text-gray-700 mr-2">{index + 1}</span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center justify-between w-32">
                        <span className="text-gray-600">{formatCurrency(item.price)}</span>
                        <span className="text-gray-900 font-bold">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  ))}
                  <div className="text-right text-sm text-gray-600 mt-2">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                  </div>
                </div>
                
                {/* Totals */}
                <div className="bg-gray-50 p-4">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Subtotal (excl.)</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Tax (15%)</span>
                    <span className="font-medium">{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between py-1 font-bold">
                    <span>Total</span>
                    <span className="text-lg">{formatCurrency(totalWithTax)}</span>
                  </div>
                </div>
              </div>
              
              {/* Customer & Payment Options */}
              <div className="p-4 space-y-4">
                {/* Customer */}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Customer</span>
                  <div className="flex items-center">
                    <span className="text-gray-900 mr-4">{customer}</span>
                    <button 
                      onClick={handleAddCustomer}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 flex items-center"
                    >
                      <Plus size={14} className="mr-1" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
                
                {/* Show customer details if a customer is selected */}
                {selectedCustomerDetails && (
                  <div className="bg-gray-50 p-3 rounded-md mb-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Billing Address</h4>
                        <div className="text-xs text-gray-600">
                          <p>{selectedCustomerDetails.billingAddress.street}</p>
                          <p>{selectedCustomerDetails.billingAddress.city}, {selectedCustomerDetails.billingAddress.state} {selectedCustomerDetails.billingAddress.postalCode}</p>
                          <p>{selectedCustomerDetails.billingAddress.country}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Shipping Address</h4>
                        <div className="text-xs text-gray-600">
                          <p>{selectedCustomerDetails.shippingAddress.street}</p>
                          <p>{selectedCustomerDetails.shippingAddress.city}, {selectedCustomerDetails.shippingAddress.state} {selectedCustomerDetails.shippingAddress.postalCode}</p>
                          <p>{selectedCustomerDetails.shippingAddress.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Order Discount */}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Order Discount</span>
                  <div className="flex items-center">
                    <span className="text-gray-900 mr-4">{formatCurrency(parseFloat(orderDiscount))}</span>
                    <button 
                      onClick={handleAddDiscount}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 flex items-center"
                    >
                      <Plus size={14} className="mr-1" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
                
                {/* Coupon Code */}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Coupon Code</span>
                  <div className="flex items-center">
                    <div className="flex-1 mr-4">
                      <input
                        type="text"
                        placeholder="Enter coupon code..."
                        className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={handleAddCoupon}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 flex items-center"
                    >
                      <Plus size={14} className="mr-1" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
                
                {/* Payment Method */}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Payment Method</span>
                  <div className="flex items-center">
                    <select 
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="Pesapal">Pesapal</option>
                    </select>
                    <button 
                      onClick={handlePaymentMethodChange}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 flex items-center ml-2"
                    >
                      <Plus size={14} className="mr-1" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
                
                {/* Order Note */}
                <div className="py-2 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Order Note</span>
                    <div className="flex items-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <span className="mr-2 text-sm text-gray-600">Send to customer</span>
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={sendNoteToCustomer}
                            onChange={() => setSendNoteToCustomer(!sendNoteToCustomer)}
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <textarea
                    placeholder="Add note about this order..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="border-t border-gray-200 p-4 mt-auto">
              <div className="grid grid-cols-2 gap-2">
                <button 
                  className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                  onClick={handleCloseCheckout}
                >
                  Close
                </button>
                <button 
                  className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  onClick={handleCheckout}
                >
                  <ChevronRight size={16} />
                  <span>Next</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Regular Cart View
          <>
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
                          loading="lazy"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{item.name}</h4>
                        <div className="text-sm text-gray-500">{formatCurrency(item.price)}</div>
                        <div className="flex items-center mt-2">
                          <button 
                            className="p-1 border border-gray-300 rounded-l-md hover:bg-gray-100"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 py-1 border-t border-b border-gray-300">{item.quantity}</span>
                          <button 
                            className="p-1 border border-gray-300 rounded-r-md hover:bg-gray-100"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                            disabled={item.stock_quantity !== undefined && item.quantity >= item.stock_quantity}
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
                          aria-label={`Remove ${item.name} from cart`}
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
                <button 
                  className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                  onClick={() => router.push('/dashboard')}
                  disabled={checkoutInProgress || checkoutSuccess}
                >
                  Cancel
                </button>
                {checkoutSuccess ? (
                  <button 
                    className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md"
                    disabled
                  >
                    <Check size={16} />
                    <span>Order Placed!</span>
                  </button>
                ) : (
                  <button 
                    className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={handleShowCheckout}
                    disabled={cartItems.length === 0 || checkoutInProgress || isLoading}
                  >
                    {checkoutInProgress || isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={16} />
                        <span>Checkout</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Customer Selection Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Customer</h3>
            </div>
            
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={customerSearchTerm}
                  onChange={(e) => setCustomerSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <button className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
              <div className="flex-1">
                <span className="text-blue-500 font-medium">Create New Customer</span>
              </div>
              <Plus size={18} className="text-blue-500" />
            </div>
            
            <div className="overflow-y-auto flex-1">
              {filteredCustomers.map(customer => (
                <div 
                  key={customer.id}
                  className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectCustomer(customer)}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        {customer.username && (
                          <div className="text-sm text-gray-500">({customer.username})</div>
                        )}
                        <div className="text-sm text-blue-500">{customer.email}</div>
                      </div>
                      <div className="text-gray-400">
                        #{customer.id}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 ml-2" />
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <button 
                className="w-full text-center py-2 text-gray-500"
                onClick={() => setShowCustomerModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
