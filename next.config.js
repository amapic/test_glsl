/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@react-three/drei"],
  basePath: "/slide",
 
  distDir: "/slide",
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack: (config, { isServer }) => {
    // If client-side, don't polyfill `fs`
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    // config.resolve = {
    //   "extensions": [".web.js", ".js"]
    // }

    return config;
  },
};

module.exports = nextConfig;
