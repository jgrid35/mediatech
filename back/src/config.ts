import dotenv from 'dotenv'

dotenv.config();

export type Config = {
    server: {
        https: boolean;
    }
    omdb: {
        apiKey: string | null,
    },
    freebox: {
        ftps: boolean,
        host: string,
        port: number,
        username: string,
        password: string | null,
        folder: string
    }
}

export const config: Config = {
    server:
    {
        https: process.env.USE_HTTPS === 'true'
    },
    omdb: {
        apiKey: process.env.OMDB_API_KEY || null,
    },
    freebox: {
        ftps: process.env.FREEBOX_USE_FTPS === 'true',
        host: process.env.FREEBOX_HOST,
        port: Number(process.env.FREEBOX_PORT),
        username: process.env.FREEBOX_USER,
        password: process.env.FREEBOX_PASSWORD || null,
        folder: process.env.FREEBOX_MEDIA_FOLDER
    }
};