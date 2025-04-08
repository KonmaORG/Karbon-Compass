// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // output: "export",
//   // target: "serverless",
//   eslint: {
//     // Warning: This allows production builds to successfully complete even if
//     // your project has ESLint errors.
//     ignoreDuringBuilds: true,
//   },
//   webpack: (config) => {
//     config.experiments = {
//       ...config.experiments,
//       asyncWebAssembly: true,
//       topLevelAwait: true,
//       layers: true,
//     };
//     return config;
//   },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export", // Uncomment if you need static site generation
  // target: "serverless", // Deprecated in newer Next.js versions; remove unless specifically needed
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Enable WebAssembly and other experimental features
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true, // Already present, enables async WASM loading
      topLevelAwait: true, // Already present, useful for async imports
      layers: true, // Already present, experimental feature
    };

    // Add rule to handle .wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    // Ensure WASM files are output correctly in client-side builds
    if (!isServer) {
      config.output.webassemblyModuleFilename = "static/wasm/[modulehash].wasm";
    }

    // Optional: Prevent Node.js-specific code from breaking client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, // Prevent Node.js 'fs' module issues
        path: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
