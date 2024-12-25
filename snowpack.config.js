// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    src: '/dist',
    public: { url: '/', static: true }
  },
  plugins: [
    '@snowpack/plugin-typescript'
  ],
  buildOptions: {
    out: 'build'
  }
};