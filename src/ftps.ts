import { Client } from 'basic-ftp';
import { config } from './config.js';

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


