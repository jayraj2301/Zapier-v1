import { Router } from "express";
import prismaClient from '@repo/db';

const router = Router();

router.get("/available", async (req, res) => {
    const availableTriggers = await prismaClient.availableTrigger.findMany({});
    res.json({
        availableTriggers
    })
});

export const triggerRouter = router;