/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // ImgBB uploaded images
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },

      // Other common image/CDN hosts
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },

      // Allow any HTTPS image host
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;