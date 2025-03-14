import React from 'react';
import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function SignInPage() {
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
        <p className="text-gray-600">Sign in to your account</p>
      </div>
      
      <div className="w-full max-w-md">
        <SignIn 
          path="/auth/sign-in"
          routing="path"
          signUpUrl="/auth/sign-up"
          redirectUrl="/dashboard"
        />
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>Don&apos;t have an account? <Link href="/auth/sign-up" className="text-blue-600 hover:text-blue-800 font-medium">Sign up</Link></p>
      </div>
    </div>
  );
} 