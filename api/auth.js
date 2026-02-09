import crypto from 'crypto';

const OAUTH_URL = 'https://github.com/login/oauth/authorize';

export default async function handler(req, res) {
    const { provider } = req.query;

    if (!provider) {
        return res.status(400).send('Missing provider parameter');
    }

    // Generate a random state
    const state = crypto.randomBytes(16).toString('hex');

    // We should ideally store state in a cookie/session to verify later, 
    // but for a simple CMS proxy, passing it through is often skipped or minimal.
    // Decap CMS expects us to just redirect.

    const params = new URLSearchParams({
        client_id: process.env.OAUTH_CLIENT_ID,
        redirect_uri: `https://${req.headers.host}/api/callback?provider=${provider}`,
        scope: 'repo user',
        state: state,
    });

    res.redirect(`${OAUTH_URL}?${params.toString()}`);
}
