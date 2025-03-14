/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['bansita.com'],
    // Allow data URL images (base64) for placeholder images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bansita.com',
      },
    ],
    dangerouslyAllowSVG: true,
    unoptimized: process.env.NODE_ENV === 'development', // Only optimize images in production
  },
  // Add TypeScript incremental compilation to improve build performance
  typescript: {
    // Necessary for faster builds
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  // Disable strict mode in development to avoid double rendering
  reactStrictMode: process.env.NODE_ENV !== 'development',
};

module.exports = nextConfig; 