import z from "zod";

export const signUpSchema = z.object({
    name: z.string().min(5).max(30),
    email: z.email(),
    password: z.string()
        .min(8, "Minimum 8 characters")
        .max(30)
        .regex(/[A-Z]/, "Must contain uppercase")
        .regex(/[0-9]/, "Must contain number")
})