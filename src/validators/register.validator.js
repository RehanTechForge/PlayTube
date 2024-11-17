import { z } from "zod";

const registerSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .regex(
      /^[a-z0-9_]+$/,
      "Username must be lowercase and contain only letters, numbers, or underscores"
    )
    .trim(),
  email: z
    .string()
    .email("Invalid email format")
    .min(1, "Email is required")
    .trim(),
  fullName: z.string().min(1, "Full name is required").trim(),
  avatar: z
    .string()
    .url("Avatar must be a valid URL")
    .min(1, "Avatar URL is required"),
  coverImage: z.string().url("Cover image must be a valid URL").optional(),
  watchHistory: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"))
    .optional(),
  password: z.string().min(1, "Password is required"),
  refreshToken: z.string().optional(),
  createdAt: z.date().optional(), // For timestamps
  updatedAt: z.date().optional(), // For timestamps
});

export default registerSchema;
