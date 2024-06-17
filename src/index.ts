import * as fs from 'fs';
import * as zlib from 'zlib';
import * as readline from 'readline';
import * as path from 'path';
import os from 'os';
import express from 'express';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// const app = express();

// app.get('/', (req, res) => {
//     res.send('Hello, World!');
// });

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });

rl.question('Enter file names (separated by comma): ', (inputFileNames) => {
    rl.question('Name your compressed folder (or leave blank): ', (folderName) => {
        if (!folderName.trim()){
            const date = new Date();
            folderName = date.toISOString().slice(0, 10).replace(/-/g, '');
        }

        const desktopFolder = path.join(os.homedir(),'Desktop');
        const outputFolder = path.join(desktopFolder, 'PiperLink Files');
        const fileNames = inputFileNames.split(',').map(name => name.trim());

        // if(!fs.existsSync(inputFileName)){
        //     console.log(`${inputFileName} does not exist`);
        //     rl.close();
        // }

        if(!fs.existsSync(outputFolder)){
            fs.mkdirSync(outputFolder);
        }

        fileNames.forEach((fileName) => {
            if(!fs.existsSync(fileName)){
                console.log(`${fileName} does not exist`);
                rl.close();
            }

            // const outputFileName = `${path.basename(fileName, path.extname(fileName))}-compressed.gz`;
            const outputFileName = `${path.basename(fileName, path.extname(folderName))}-compressed.gz`;
            const outputPath = path.join(outputFolder, outputFileName);

            const readStream = fs.createReadStream(fileName);
            const writeStream = fs.createWriteStream(outputPath);

            const gzip = zlib.createGzip();

            readStream.pipe(gzip).pipe(writeStream);

            writeStream.on('finish', () => {
                console.log(`File ${fileName} compressed successfully. Compressed file: ${outputPath}`);
                // rl.close();
            })
        })

        rl.close();
    })
})