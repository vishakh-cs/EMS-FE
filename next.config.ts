import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://194.164.150.122:3045/api/'}:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
