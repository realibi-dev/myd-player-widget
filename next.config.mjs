/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        esmExternals: "loose",
    },
    webpack: (config) => {
        config.resolve.fallback = { fs: false };
        return config;
    }
};

export default nextConfig;
