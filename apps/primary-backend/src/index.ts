import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { userRouter } from './router/user.js';
import { zapRouter } from './router/zap.js';
import { actionRouter } from './router/action.js';
import { triggerRouter } from './router/trigger.js';

dotenv.config({
    path: "./.env"
})

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/zap', zapRouter);
app.use('/api/v1/trigger', triggerRouter);
app.use('/api/v1/action', actionRouter);

app.listen(3000, ()=> console.log('Backend Running..,'));