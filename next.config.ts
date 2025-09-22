import nextra from "nextra";

const withNextra = nextra({
  defaultShowCopyCode: true,
});

export default withNextra({
  turbopack: {
    resolveAlias: {
      "next-mdx-import-source-file": "./src/mdx-components.tsx",
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.ignoreWarnings = [
        { module: /leaflet/ },
        { module: /react-leaflet/ },
      ];
    }
    return config;
  },
});
