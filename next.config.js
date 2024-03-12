/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['pino'],
  },
  webpack: (config) => {
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt", "mailgen");
    return config;
  }
};

module.exports = nextConfig;
