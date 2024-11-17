const _config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  CORS: process.env.CORS,
};

const config = Object.freeze(_config);
export default config;
