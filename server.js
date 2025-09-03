import express from 'express';
import connectToMongoDB from './db/connectToMongoDB.js';
import cookieParser from 'cookie-parser';
import authRouter from './controller/auth.controller.js';
import resumeRouter from './controller/resume.controller.js'

const app = express();

app.use(cookieParser());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use("/api/auth", authRouter);
app.use("/api/resume", resumeRouter);

app.listen(3000, () => {
    connectToMongoDB();
    console.log('Server is running on port 3000');
});