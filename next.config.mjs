/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "https://two-school-backend.onrender.com",
        pathname: "/tTiers/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/Tiers/**",
      },
    ],
  },
};

export default nextConfig;
