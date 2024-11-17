import ApiError from "../utils/apiError.js";
import logger from "../../logger.js";
const validate = (schema) => async (req, res, next) => {
  try {
    const parsedBody = await schema.parseAsync(req.body);
    req.body = parsedBody; 
    next(); 
  } catch (err) {
    
    const errors = err.errors.map((e) => ({
      path: e.path,
      message: e.message,
    }));

    
    logger.error(`Validation Failed: ${JSON.stringify(errors)}`);

    
    return res.status(400).json(new ApiError(400, "Validation failed", errors));
  }
};

export default validate;
