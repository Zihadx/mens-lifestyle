/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage
      {
        protocol: "https",
        hostname: "czxbnofeqcqgsfbjjqge.supabase.co",
        pathname: "/storage/v1/object/**",
      },

      // ImgBB
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
        pathname: "/**",
      },

      // Other image hosts
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "czxbnofeqcqgsfbjjqge.supabase.co",
        pathname: "/storage/v1/object/public/zyqo/**",
      }
    ],
  },
};

module.exports = nextConfig;
