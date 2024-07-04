/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/drafts/**",
            },
            {
                protocol: "https",
                hostname: "**.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/posts/**",
            },
        ],
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/home",
                permanent: true,
            },
        ]
    },
};

export default nextConfig;
