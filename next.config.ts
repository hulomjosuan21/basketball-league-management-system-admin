import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/administrator',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
