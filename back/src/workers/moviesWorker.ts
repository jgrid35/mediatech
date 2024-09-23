import { parseMovies } from "../scripts/parseMovies.js";
import cron from 'node-cron';

export const startWorker = () => {
    console.log("starting worker ...");
    cron.schedule('0 * * * *', async function() {
        console.log("launching cron");
        await parseMovies();
    });
}
