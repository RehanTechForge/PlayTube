import ApiError from "../utils/apiError.js";

const validate = (schema) => async (req, res, next) => {
  try {
    const parsedBody = await schema.parseAsync(req.body); // Validate request body against schema
    req.body = parsedBody; // Replace req.body with parsed data
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // Extract validation errors
    const errors = err.errors.map((e) => ({
      path: e.path,
      message: e.message,
    }));

    // Log the error
    logger.error(`Validation Failed: ${JSON.stringify(errors)}`);

    // Send error response using ApiError
    return res.status(400).json(new ApiError(400, "Validation failed", errors));
  }
};

export default validate;
