/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    API_URI: process.env.API_URI,
  },
};

module.exports = nextConfig;
