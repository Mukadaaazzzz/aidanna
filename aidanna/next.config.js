/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Disable image optimization for Netlify
  },
};

module.exports = nextConfig;
