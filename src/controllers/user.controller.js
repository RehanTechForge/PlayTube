import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  removeFromCloudinary,
} from "../utils/cloudinary.js";
import logger from "../../logger.js";
import { OPTIONS } from "../constant.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body;
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(400, "Username Or Email Already Exists in our DB");
  }

  let avatarLocalPath = req.files?.avatar?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(401, "Avatar is required");
  }

  let coverImageLocalPath = req.files?.coverImage?.[0]?.path || "";

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
  } catch (error) {
    logger.error(`Error While Uploading Avatar: ${error.message || error}`);
    throw new ApiError(501, "Error While Uploading Avatar");
  }

  if (!avatar.url) {
    throw new ApiError(501, "Error While Uploading Avatar");
  }

  let coverImage;
  if (coverImageLocalPath) {
    try {
      coverImage = await uploadOnCloudinary(coverImageLocalPath);
    } catch (error) {
      logger.error(
        `Error While Uploading coverImage: ${error.message || error}`
      );
      throw new ApiError(501, "Error While Uploading coverImage");
    }
  }

  try {
    const user = await User.create({
      username,
      fullName,
      email,
      password,
      avatar: avatar.url,
      coverImage: coverImage.url || "",
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken -watchHistory -__v"
    );

    if (!createdUser) {
      throw new ApiError(501, "Server Error While Creating User");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User Created Successfully"));
  } catch (error) {
    logger.error(`User Creation Failed`);
    if (avatar) {
      await removeFromCloudinary(avatar.public_id);
    }
    if (coverImage) {
      await removeFromCloudinary(coverImage.public_id);
    }
    throw new ApiError(501, "Server Error While Creating User");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User Not Found Please Sign Up");
  }

  const isPasswordValid = user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Credentials");
  }

  const { accessToken, refreshToken } = generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, OPTIONS)
    .cookie("refreshToken", refreshToken, OPTIONS)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

export { registerUser, loginUser };
