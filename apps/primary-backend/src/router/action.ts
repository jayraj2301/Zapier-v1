import { Router } from "express";
import prismaClient from '@repo/db';

const router = Router();

router.get("/available", async (req, res) => {
    const availableActions = await prismaClient.availableAction.findMany({});
    res.json({
        availableActions
    })
});

export const actionRouter = router;