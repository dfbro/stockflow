import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['mikir.lylo.eu.org', '127.0.0.1:9002'],
      allowedForwardedHosts: ['mikir.lylo.eu.org', '127.0.0.1:9002'],
    },
    allowedDevOrigins: ['mikir.lylo.eu.org'],
  },
};

export default nextConfig;
