import * as fs from 'fs';
import * as zlib from 'zlib';
import * as readline from 'readline';
import * as path from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('Enter file name: ', (inputFileName) => {
    const desktopFolder = path.join('C:\\Users\\matti\\Desktop');
    const outputFolder = path.join(desktopFolder, 'Compressed-Files');

    if(!fs.existsSync(inputFileName)){
        console.log(`${inputFileName} does not exist`);
        rl.close();
    }

    if(!fs.existsSync(outputFolder)){
        fs.mkdirSync(outputFolder);
    }

    const outputFileName = `${path.basename(inputFileName, path.extname(inputFileName))}-compressed.gz`;
    const outputPath = path.join(outputFolder, outputFileName);

    const readStream = fs.createReadStream(inputFileName);
    const writeStream = fs.createWriteStream(outputPath);

    const gzip = zlib.createGzip();

    readStream.pipe(gzip).pipe(writeStream);

    writeStream.on('finish', () => {
        console.log(`File ${inputFileName} compressed successfully. Compressed file: ${outputPath}`);
        rl.close();
    })
})