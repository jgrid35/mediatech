import { Client, FileInfo } from 'basic-ftp';
import { config } from './config.js';
import { Writable } from 'stream';


export async function ftpConnect(): Promise<Client> {
    const client = new Client()
    client.ftp.verbose = true
    try {
        await client.access({
            host: config.freebox.host,
            user: config.freebox.username,
            password: config.freebox.password,
            secure: true,
            port: config.freebox.port,
            secureOptions: {
                rejectUnauthorized: false
            }
        })
    }
    catch (err) {
        console.log(err)
    }
    return client;
}

export async function getMovieList(): Promise<Array<string>> {
    const client = await ftpConnect();
    let movies: Array<string>;
    
    try {
        await client.cd(config.freebox.folder);
        const movieFolders: Array<FileInfo> = await client.list();
        movies = movieFolders.filter(mf => mf.type === 2).map(mf => mf.name);
    }
    catch(error){ 
        console.error('FTP Operation Error:', error);
    }
    finally{
        client.close();
    }
    return movies;
}

export async function downloadMovie(res: Express.Response, filePath: string): Promise<void> {
    const client = await ftpConnect();
    try {
        await client.downloadTo(res as Writable, filePath);
    }
    catch(error){ 
        console.error('FTP Operation Error:', error);
    }
    finally{
        client.close();
    }
}
