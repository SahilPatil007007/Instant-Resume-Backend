import express from 'express';
import connectToMongoDB from './db/connectToMongoDB.js';
import cookieParser from 'cookie-parser';
import authRouter from './controller/auth.controller.js';
import resumeRouter from './controller/resume.controller.js';
import aiRouter from './controller/ai.controller.js';
import protectRoute from './middelware/protectRoute.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : [
        "http://localhost:5173",
        "https://resumeai-in.netlify.app"
    ];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get("/api/me", protectRoute ,(req, res) => {
    res.json(req.user);
})

app.use("/api/auth", authRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/ai", aiRouter);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

app.listen(3000, () => {
    connectToMongoDB();
    console.log('Server is running on port 3000');
});