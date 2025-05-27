import {z} from "zod"

export const SignUpSchema = z.object(
    {
        firstName : z.string().min(1, "First name is required"),
        lastName : z.string().min(1, "Second name is required"),
        email : z.string().email("Invalid email"),
        password : z.string().min(6, "Password must be at least 6 characters"),
    }
)

export type SignUpInput = z.infer<typeof SignUpSchema>;
