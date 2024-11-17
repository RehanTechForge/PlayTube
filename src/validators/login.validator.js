import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(1, "Email is required")
    .trim(),
  password: z.string().min(1, "Password is required"),
});

export default loginSchema;
