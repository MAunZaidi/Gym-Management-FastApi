import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return ["dashboard", "members", "membership-plans", "payments", "bookings", "attendance"].map((route) => ({
      source: `/${route}`,
      destination: route === "dashboard" ? "/admin" : `/admin/${route}`,
      permanent: false
    }));
  }
};

export default nextConfig;
