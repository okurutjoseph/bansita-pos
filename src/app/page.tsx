import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div 
      className="h-[100vh] w-full flex flex-col bg-cover bg-center bg-no-repeat" 
      style={{ backgroundImage: 'url(/hero.svg)' }}
    >
      {/* Header with Bansita logo and sign in button */}
      <header className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 relative mr-2">
              <Image 
                src="/bansita.svg" 
                alt="Bansita POS" 
                fill 
                className="object-contain"
              />
            </div>
          </div>
          <div>
            <Link 
              href="/auth/sign-in" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}
