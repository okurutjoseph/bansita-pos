"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { 
  PlusCircle, 
  ShoppingCart, 
  FileText, 
  Users, 
  Package, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import ErrorBoundary from './ErrorCatcher';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { signOut } = useClerk();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    {
      label: 'New Order',
      href: '/dashboard/new-order',
      icon: PlusCircle,
      active: pathname === '/dashboard/new-order',
    },
    {
      label: 'Sale',
      href: '/dashboard/sale',
      icon: ShoppingCart,
      active: pathname === '/dashboard/sale',
    },
    {
      label: 'Orders',
      href: '/dashboard/orders',
      icon: FileText,
      active: pathname === '/dashboard/orders',
    },
    {
      label: 'Customers',
      href: '/dashboard/customers',
      icon: Users,
      active: pathname === '/dashboard/customers',
    },
    {
      label: 'Products',
      href: '/dashboard/products',
      icon: Package,
      active: pathname === '/dashboard/products',
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      active: pathname === '/dashboard/settings',
    },
  ];

  return (
    <ErrorBoundary>
      <div className={`flex flex-col h-full bg-blue-500 text-white ${collapsed ? 'w-20' : 'w-24'} transition-all duration-300 ${className}`}>
        <div className="flex justify-center items-center py-4">
          <Link href="/dashboard">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 relative">
                <Image 
                  src="/logo.svg" 
                  alt="Bansita POS" 
                  fill 
                  className="object-contain"
                />
              </div>
              {!collapsed && <span className="mt-1 text-xs font-semibold">Bansita POS</span>}
            </div>
          </Link>
        </div>
        
        <div className="flex-1">
          <nav className="flex flex-col items-center gap-4 py-4">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex flex-col items-center p-2 rounded-md w-full ${
                  item.active ? 'bg-blue-600' : 'hover:bg-blue-600'
                }`}
              >
                <item.icon className={`${collapsed ? 'h-6 w-6' : 'h-6 w-6'}`} />
                {!collapsed && <span className="mt-1 text-xs">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-4 flex flex-col items-center">
          <button 
            onClick={() => signOut()}
            className="flex flex-col items-center hover:bg-blue-600 p-2 rounded-md w-full"
          >
            <LogOut className={`${collapsed ? 'h-6 w-6' : 'h-6 w-6'}`} />
            {!collapsed && <span className="mt-1 text-xs">Logout</span>}
          </button>
          
          <button 
            onClick={toggleSidebar} 
            className="mt-4 p-2 bg-blue-600 rounded-full hover:bg-blue-700"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Sidebar;
