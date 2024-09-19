import dotenv from 'dotenv'

dotenv.config();

export type Config = {
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
    omdb: {
        apiKey: process.env.OMDB_API_KEY || null,
    },
    freebox: {
        ftps: Boolean(process.env.FREEBOX_USE_FTPS),
        host: process.env.FREEBOX_HOST,
        port: Number(process.env.FREEBOX_PORT),
        username: process.env.FREEBOX_USER,
        password: process.env.FREEBOX_PASSWORD || null,
        folder: process.env.FREEBOX_MEDIA_FOLDER
    }
};