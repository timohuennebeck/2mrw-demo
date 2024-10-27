const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.imgur.com",
            },
        ],
        domains: ["framerusercontent.com"],
    },
};

export default nextConfig;
