import express from 'express';
import connectToMongoDB from './db/connectToMongoDB.js';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3000, () => {
    connectToMongoDB();
    console.log('Server is running on port 3000');
});