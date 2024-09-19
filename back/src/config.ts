import dotenv from 'dotenv'

dotenv.config();

export type Config = {
    google: {
        serviceAccount:
        {
            email: string,
        },
        spreadsheet:
        {
            id: string,
        }
    },
    omdb: {
        apiKey: string,
    },
    freebox: {
        host: string,
        port: number,
        username: string,
        password: string,
        folder: string
    }
}

export const config: Config = {
    google: {
        serviceAccount:
        {
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
        },
        spreadsheet:
        {
            id: process.env.SPREADSHEET_ID || '',
        }
    },
    omdb: {
        apiKey: process.env.OMDB_API_KEY || '',
    },
    freebox: {
        host: process.env.FREEBOX_HOST,
        port: Number(process.env.FREEBOX_PORT),
        username: process.env.FREEBOX_USER,
        password: process.env.FREEBOX_PASSWORD,
        folder: process.env.FREEBOX_MEDIA_FOLDER
    }
};