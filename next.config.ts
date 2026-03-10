import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use webpack instead of Turbopack for better compatibility with Stacks libraries
  // Stacks libraries use Node.js modules that need polyfills
};

export default nextConfig;
