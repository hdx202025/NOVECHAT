/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Enable static exports for mobile compatibility
  output: 'export',
  // Disable server components when exporting
  experimental: {
    appDir: true,
  },
  // Ensure paths work on mobile devices
  trailingSlash: true,
  // Disable image optimization for static export
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig 