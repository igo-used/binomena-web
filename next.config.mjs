/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BLOCKCHAIN_API_URL: process.env.NEXT_PUBLIC_BLOCKCHAIN_API_URL || 'https://binomena-node.onrender.com',
    NEXT_PUBLIC_APP_DOMAIN: process.env.NEXT_PUBLIC_APP_DOMAIN || 'www.binomchainapp.fyi'
  }
};

export default nextConfig;
