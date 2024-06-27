import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import mongoose from 'mongoose';

const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const upload = multer({ dest: 'uploads/' });

const mongoUrl = 'mongodb+srv://mattrcsimpson:fvBMFuqnNFd0Qjy8@cluster0.0vx3brm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUrl);

const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));

connection.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});

// This route handles the POST request to upload a file. It uses multer middleware to process the file upload.
// After the file is processed, it calls the compressAndUpload function to compress the file and upload it to MongoDB.
app.post('/api/v1/upload', upload.single('file'), async (req: Request, res: Response) => {
    uploadRoutes(req, res, connection);
});

// This starts the server and listens on port 3000. When the server starts, it logs a message to the console.
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});