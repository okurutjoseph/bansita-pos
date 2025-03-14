import React from 'react';
import { SignUp } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="mb-8 text-center">
        <div className="inline-block relative w-16 h-16 mb-2">
          <Image 
            src="/logo.svg" 
            alt="Bansita POS" 
            fill 
            className="object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Bansita POS</h1>
        <p className="text-gray-600">Create a new account</p>
      </div>
      
      <div className="w-full max-w-md">
        <SignUp 
          path="/auth/sign-up"
          routing="path"
          signInUrl="/auth/sign-in"
          redirectUrl="/dashboard"
        />
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>Already have an account? <Link href="/auth/sign-in" className="text-blue-600 hover:text-blue-800 font-medium">Sign in</Link></p>
      </div>
    </div>
  );
} 