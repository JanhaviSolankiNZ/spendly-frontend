import { z } from "zod";
export const signInSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required")
});

export type SignInData = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
    email: z.string().min(1,"Email is required").email("Enter a valid email address"),
    password: z.string().min(7, "Password must be at least 7 characters long")
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{7,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    username: z.string().min(3, "Username must be at least 3 characters long").max(15, "Username must be under 15 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores")
});

export type SignUpData = z.infer<typeof signUpSchema>;
