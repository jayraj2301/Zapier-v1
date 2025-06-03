import { z } from "zod"

export const SignupSchema = z.object({
    email: z.string().email().min(5),
    password: z.string().min(6),
    username: z.string().min(3)
});

export const SigninSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const VerifySchema = z.object({
    email: z.string().email(),
    otp: z.number()
})

export const ZapCreateSchema = z.object({
    availableTriggerId: z.string(),
    triggerMetadata: z.any().optional(),
    actions: z.array(z.object({
        availableActionId: z.string(),
        actionMetadata: z.any().optional(),
    }))
});