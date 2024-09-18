import { Client, FileInfo } from 'basic-ftp';
import {config} from './config.js';
import fs from 'fs';

example('test');

async function example(movie: string) {
    var stream:fs.WriteStream = fs.createWriteStream(movie, {flags: 'a'});
    const client = new Client()
    client.ftp.verbose = true
    try {
        await client.access({
            host: config.freebox.host,
            user: config.freebox.username,
            password: config.freebox.password,
            secure: true,
            port: config.freebox.port,
            secureOptions:{
                rejectUnauthorized: false
            }
        })

        // await client.cd("Freebox/Media/Films/Cobweb")
        let movieFolders:Array<FileInfo> = await client.list()
        console.log(movieFolders);
        let movies:Array<string> = movieFolders.filter(mf => mf.type === 2).map(mf => mf.name);
        await client.downloadTo(stream,movie);
        
    }
    catch(err) {
        console.log(err)
    }
    client.close()
}


