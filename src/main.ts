import { getAuthenticatedClient } from "./oauth.js";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import fs from 'fs';
import {config, Config} from './config.js';

async function main() {
    const apiKey = config.omdb.apiKey;
    const omdbApi = `https://www.omdbapi.com/?apikey=${apiKey}&`;
    
    const folder = String.raw`\\Freebox_Server\Freebox\Media\Films`;
    
    const movies = fs.readdirSync(folder);
    
    const oAuth2Client = await getAuthenticatedClient();
    
    
    const spreadsheetId = config.google.spreadsheet.id;
    
    const doc = new GoogleSpreadsheet(spreadsheetId, oAuth2Client as any);
    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title)
    const sheet = doc.sheetsByIndex[0]; // or use `doc.sheetsById[id]` or `doc.sheetsByTitle[title]`
    
    for (const movie of movies) {
        let spreadSheetRow;
        console.log(movie)
        const url = omdbApi + new URLSearchParams({ t: movie });
        const res = await fetch(url);
        const metadata = await res.json();
        console.log(metadata)
        if (metadata.Response === 'True'){
            spreadSheetRow = {
                Nom: metadata.Title,
                Réalisateur: metadata.Director,
                Année: metadata.Year,
                Durée: metadata.Runtime,
                Langue: metadata.Language,
                Pays: metadata.Country
            }
        }
        else {
            spreadSheetRow = {
                Nom: movie,
            }
        }
    
        await sheet.addRow(spreadSheetRow);
    }
}

main();