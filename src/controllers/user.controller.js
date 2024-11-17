import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
const registerUser = asyncHandler(async (req, res) => {
  console.log("hello");
  const { username, fullName, email, password } = req.body;
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { username, fullName, email, password },
        "All Field Are Here"
      )
    );
});
export { registerUser };
