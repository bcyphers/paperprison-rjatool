/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Rewrite everything to `pages/index`
      {
        source: "/:any*",
        destination: "/",
      },
    ];
  },
  assetPrefix: process.env.DEBUG
    ? null
    : "https://blessdyb.github.io/paperprison-rjatool/",
};

module.exports = nextConfig;
