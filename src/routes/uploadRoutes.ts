import { Request, Response } from 'express';
import { GridFSBucket } from 'mongodb';
import zlib from 'zlib';
import path from 'path';
import * as fs from 'fs';

const upload = async (req: Request, res: Response, connection: any) => {
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

        uploadStream.on('error', (error: any) => {
            console.error('Error uploading to MongoDB Atlas', error);
            res.status(500).send('Error uploading to MongoDB Atlas');
        });

        readStream.pipe(uploadStream);
        fs.createReadStream(file.path).pipe(readStream);
    
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
    
};

export default upload;