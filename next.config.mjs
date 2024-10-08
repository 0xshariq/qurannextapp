/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['cdn.islamic.network'], // Add this line to allow images from the specified domain
    },
  };

export default nextConfig;
