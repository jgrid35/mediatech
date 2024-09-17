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
    }
};