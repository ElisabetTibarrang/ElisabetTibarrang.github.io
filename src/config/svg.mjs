// src/config/svg.mjs

const commonPlugins = [
  {
    name: "preset-default",
  },
  "removeDimensions",
  "removeScripts",
];

export const svgConfig = {
  input: {
    mono: "src/assets/icons/mono",
    brand: "src/assets/icons/brand",
  },

  output: {
    public: {
      mono: "public/icons/mono",
      brand: "public/icons/brand",
    },
    data: {
      mono: "src/data/icons/mono",
      brand: "src/data/icons/brand",
      manifest: "src/data/icons/manifest.mjs",
    },
  },

  publicBase: "/icons",
  idPrefix: "aw-icon-",
  kinds: ["mono", "brand"],

  svgo: {
    multipass: true,

    common: {
      plugins: commonPlugins,
    },

    mono: {
      currentColor: true,
      plugins: [
        ...commonPlugins,
        "convertStyleToAttrs",
        "removeStyleElement",
      ],
    },

    brand: {
      preserveColors: true,
      plugins: commonPlugins,
    },
  },
};

export default svgConfig;