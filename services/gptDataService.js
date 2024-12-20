import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
class GptDataService {
    constructor() {
        this.folderPath=process.env.GPT_DATA_FOLDER
    }

    getLatestFile() {
        return new Promise((resolve, reject) => {
            fs.readdir(this.folderPath, (err, files) => {
                if (err) return reject(err);

                const textFiles = files
                    .map(file => ({
                        file,
                        time: fs.statSync(path.join(this.folderPath, file)).mtime.getTime()
                    }))
                    .sort((a, b) => b.time - a.time);
                

                if (textFiles.length === 0) {
                    return reject(new Error('No text files found in the folder.'));
                }

                const latestFile = path.join(this.folderPath, textFiles[0].file);
                fs.readFile(latestFile, 'utf8', (readErr, data) => {
                    if (readErr) return reject(readErr);
                    const startIndex = data.indexOf('You said:');
                    if (startIndex !== -1) {
                        // Extract content starting from "you said:"
                        const contentAfterYouSaid = data.slice(startIndex);
                        console.log('Extracted Content:');
                        console.log(contentAfterYouSaid.trim());
                        resolve(contentAfterYouSaid)
                    } else {
                        console.log('"you said:" not found in the file.');
                        resolve('')
                    }
                    // resolve('');
                });
            });
        });
    }
}

// Example usage:
// const fileService = new FileService('./your-folder-path');
// fileService.getLatestFile()
//     .then(data => console.log(data))
//     .catch(err => console.error(err));

export default GptDataService;
