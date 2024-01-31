/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/rja",
  assetPrefix: "/rja/",
  images: {
    domains: ["paperprisons.org"],
    path: "/rja/_next/image",
  },
  async rewrites() {
    return [
      // Rewrite everything to `pages/index`
      {
        source: "/:any*",
        destination: "/",
      },
    ];
  },
};

module.exports = nextConfig;
