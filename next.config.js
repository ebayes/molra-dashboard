/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['storage.googleapis.com', 'bit.ly', 'earthengine.googleapis.com'],
  },
};

module.exports = nextConfig;