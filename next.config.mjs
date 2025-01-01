/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "https://two-school-backend.onrender.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "https://two-school-backend.onrender.com",
        pathname: "/tiers/**",
      },
    ],
  },
};

export default nextConfig;
