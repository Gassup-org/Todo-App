const env = typeof process !== 'undefined' && process.env ? process.env : {};
const runtimeConfig = typeof window !== 'undefined' && window.__APP_CONFIG__ ? window.__APP_CONFIG__ : {};

const config = {
  apiBaseUrl: runtimeConfig.API_BASE_URL ?? env.API_BASE_URL ?? env.VITE_API_BASE_URL ?? '',
  nodeEnv: env.NODE_ENV ?? 'development',
};

export default config;
