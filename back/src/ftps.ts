import { Client, FileInfo } from 'basic-ftp';
import { config } from './config.js';
import { Readable, Writable } from 'stream';
import { cp, readFileSync } from 'fs';
import path from 'path';


export async function ftpConnect(): Promise<Client> {
    const client = new Client()
    client.ftp.verbose = true
    const freeboxSecretPath = `/run/secrets/freebox_secret`;
    try {
        await client.access({
            host: config.freebox.ftps ? config.freebox.host : 'mafreebox.freebox.fr',
            user: config.freebox.username,
            password: config.freebox.password ? config.freebox.password : readFileSync(freeboxSecretPath, 'utf8').trim(),
            secure: config.freebox.ftps ? true : false,
            port: config.freebox.ftps ? config.freebox.port : 21,
            secureOptions: {
                rejectUnauthorized: false
            }
        })
        client.availableListCommands = ['LIST'];
    }
    catch (err) {
        console.log(err)
    }
    return client;
}

export async function getMovieList(): Promise<Array<{ title: string, imdbID?: string, fileName?: string, srtFileName?: string }>> {
    const client = await ftpConnect();
    let movies: Array<{ title: string, imdbID?: string, fileName?: string, srtFileName?: string }> = [];
    const regexImdbID = new RegExp('^tt[0-9]*');
    const regexFileName = new RegExp('(\.mkv|\.avi|.mp4)$');
    const regexSrtFileName = new RegExp('(\.srt)$');

    try {
        await client.cd(config.freebox.folder);
        const movieFolders: Array<FileInfo> = await client.list();
        for (const movieFolder of movieFolders) {
            if (movieFolder.type !== 2) continue;
            const files = await client.list(path.join('/', config.freebox.folder, movieFolder.name));
            const imdbIDFileInfo = files.filter(f => f.type === 1 && regexImdbID.test(f.name));
            const fileNameFileInfo = files.filter(f => f.type === 1 && regexFileName.test(f.name));
            const srtFileNameFileInfo = files.filter(f => f.type === 1 && regexSrtFileName.test(f.name));

            const imdbID = imdbIDFileInfo.length >= 1 ? imdbIDFileInfo[0].name : null;
            const fileName = fileNameFileInfo.length >= 1 ? fileNameFileInfo[0].name : null;
            const srtFileName = srtFileNameFileInfo.length >= 1 ? srtFileNameFileInfo[0].name : null;

            movies.push({ title: movieFolder.name, imdbID, fileName, srtFileName })
        }
    }
    catch (error) {
        console.error('FTP Operation Error:', error);
    }
    finally {
        client.close();
    }
    return movies;
}


export async function download(res: Express.Response, filePath: string): Promise<void> {
    const client = await ftpConnect();
    try {
        await client.downloadTo(res as Writable, filePath);
    }
    catch (error) {
        console.error('FTP Operation Error:', error);
    }
    finally {
        client.close();
    }
}

export async function uploadEmptyFile(fileName: string, folder: string): Promise<void> {
    const client = await ftpConnect();
    const readableStream = new Readable();
    readableStream._read = () => { };
    readableStream.push('')
    readableStream.push(null)
    const fullPath = path.join(config.freebox.folder, folder)
    try {
        await client.ensureDir(fullPath);
    }
    catch {
        console.log(`Directory ${fullPath} exists`);
    }
    try {
        await client.uploadFrom(readableStream, fileName)
    }
    catch (error) {
        console.error('FTP Operation Error:', error);
    }
    finally {
        client.close();
    }
}
