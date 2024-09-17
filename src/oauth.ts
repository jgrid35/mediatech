import { OAuth2Client } from 'google-auth-library';
import { createServer } from 'http';
import { URL } from 'url';
import open from 'open';
import destroyer from 'server-destroy';
// Download your OAuth2 configuration from the Google
import { clientSecret } from './client-secret.js';

const web = clientSecret.web;


   
/**
* Create a new OAuth2Client, and go through the OAuth2 content
* workflow.  Return the full client to the callback.
*/
export function getAuthenticatedClient() {
    return new Promise((resolve, reject) => {
        // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
        // which should be downloaded from the Google Developers Console.
        const oAuth2Client = new OAuth2Client(
            web.client_id,
            web.client_secret,
            web.redirect_uris[0]
        );

        // Generate the url that will be used for the consent dialog.
        const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive'],
        });

        // Open an http server to accept the oauth callback. In this simple example, the
        // only request to our webserver is to /oauth2callback?code=<code>
        const server = createServer(async (req, res) => {
            try {
                if ( req?.url && req.url.indexOf('/oauth2callback') > -1) {
                    // acquire the code from the querystring, and close the web server.
                    const qs = new URL(req.url, 'http://localhost:3000')
                        .searchParams;
                    const code: string = qs.get('code') || '';
                    console.log(`Code is ${code}`);
                    res.end('Authentication successful! Please return to the console.');
                    server.destroy();

                    // Now that we have the code, use that to acquire tokens.
                    const r = await oAuth2Client.getToken(code);
                    // Make sure to set the credentials on the OAuth2 client.
                    oAuth2Client.setCredentials(r.tokens);
                    console.info('Tokens acquired.');
                    resolve(oAuth2Client);
                }
            } catch (e) {
                reject(e);
            }
        })
            .listen(3000, () => {
                // open the browser to the authorize url to start the workflow
                open(authorizeUrl, { wait: false }).then(cp => cp.unref());
            });
        destroyer(server);
    });
}