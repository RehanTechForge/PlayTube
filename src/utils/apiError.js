import config from "../config/config";

class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something Went Wrong",
    errors = [],
    stack
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.errors = errors;
    this.success = false;
    if (config.ENV === "development") {
      this.stack = stack || new Error().stack;
    } else {
      this.stack = null;
    }
  }
}

export default ApiError;
