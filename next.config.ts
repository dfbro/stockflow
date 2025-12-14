import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* other options ... */
  allowedDevOrigins: ['mikir.lylo.eu.org', '*.mikir.lylo.eu.org'],
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }, { protocol: 'http', hostname: '**' }],
  },
  experimental: {
    serverActions: {
      // see section 2
      allowedOrigins: ['mikir.lylo.eu.org'],
    },
  },
};

export default nextConfig;
