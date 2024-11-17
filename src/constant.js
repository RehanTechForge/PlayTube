import config from "./config/config.js";

const DB_NAME = "yt_backend";

const OPTIONS = {
  http: true,
  secure: config.ENV === "production" ? true : false,
};

export { DB_NAME, OPTIONS };
