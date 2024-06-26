import express, { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import multer from 'multer';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import zlib from 'zlib';
import path from 'path';
import os from 'os';


const app = express();
const upload = multer({ dest: 'uploads/' });

const mongoUrl = 'mongodb+srv://mattrcsimpson:fvBMFuqnNFd0Qjy8@cluster0.0vx3brm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUrl);

const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));

connection.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});

app.post('/compress', upload.single('file'), async(req: Request, res: Response) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).send('No file uploaded');
        }

        const readStream = zlib.createGzip();
        const outputFileName = `${path.basename(file.originalname, path.extname(file.originalname))}-piperlink.gz`;

        const bucket = new GridFSBucket(connection.db, {
            bucketName: 'piperlink'
        });

        const uploadStream = bucket.openUploadStream(outputFileName);

        uploadStream.on('finish', () => {
            console.log('File uploaded to MongoDB Atlas');
            res.send('File compressed and uploaded to MongoDB Atlas successfully');
        });

        uploadStream.on('error', (error) => {
            console.error('Error uploading to MongoDB Atlas', error);
            res.status(500).send('Error uploading to MongoDB Atlas');
        });

        readStream.pipe(uploadStream);
        fs.createReadStream(file.path).pipe(readStream);
    
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
    
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});