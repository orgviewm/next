/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ['@supabase/supabase-js', '@supabase/realtime-js'],
  webpack: (config, { dev, isServer, nextRuntime }) => {
    if (dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };
    }
    
    // Handle Supabase modules for Edge Runtime
    if (nextRuntime === 'edge') {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@supabase/realtime-js': false,
        '@supabase/supabase-js': false,
      };
    }
    
    return config;
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
};

export default nextConfig;
