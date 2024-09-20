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

export async function getMovieList(): Promise<Array<{ title: string, imdbID?: string, fileName: string }>> {
    const client = await ftpConnect();
    let movies: Array<{ title: string, imdbID?: string, fileName: string }> = [];
    const regexImdbID = new RegExp('^tt[0-9]*');
    const regexFileName = new RegExp('(\.mkv|\.avi|.mp4)$');

    try {
        await client.cd(config.freebox.folder);
        const movieFolders: Array<FileInfo> = await client.list();
        for (const movieFolder of movieFolders) {
            if (movieFolder.type !== 2) continue;
            const files = await client.list(path.join('/', config.freebox.folder, movieFolder.name));
            const imdbID = files.filter(f => f.type === 1 && regexImdbID.test(f.name));
            const fileName = files.filter(f => f.type === 1 && regexFileName.test(f.name));

            if (imdbID.length >= 1) {
                movies.push({ title: movieFolder.name, imdbID: imdbID[0].name, fileName: fileName[0].name })
            }
            else {
                movies.push({ title: movieFolder.name, fileName: fileName[0].name })
            }
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


export async function downloadMovie(res: Express.Response, filePath: string): Promise<void> {
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
