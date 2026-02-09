const TOKEN_URL = 'https://github.com/login/oauth/access_token';

export default async function handler(req, res) {
    const { code, state, provider } = req.query;

    if (!code || !state) {
        return res.status(400).send('Missing code or state');
    }

    try {
        const response = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.OAUTH_CLIENT_ID,
                client_secret: process.env.OAUTH_CLIENT_SECRET,
                code,
                state,
            }),
        });

        const data = await response.json();

        if (data.error) {
            return res.status(400).send(data.error_description || data.error);
        }

        const token = data.access_token;
        const providerStr = provider || 'github';

        // Post message back to the window (Decap CMS listens for this)
        const script = `
      <script>
        (function() {
          function receiveMessage(e) {
            console.log("receiveMessage %o", e);
            
            // Check origin if necessary
            // window.opener.postMessage(
            //   '${providerStr}:${token}',
            //   e.origin
            // );
            
            // Send message to opener
            window.opener.postMessage("authorization:${providerStr}:success:${JSON.stringify({
            token: '${token}',
            provider: '${providerStr}'
        })}", "*");
            
            // Also supported by some versions:
            window.opener.postMessage("authorization:github:success:${JSON.stringify({
            token: '${token}',
            provider: 'github'
        })}", "*");
          }
          // Immediate send
          window.opener.postMessage("authorization:${providerStr}:success:${JSON.stringify({
            token: '${token}',
            provider: '${providerStr}'
        })}", "*");
          window.close();
        })()
      </script>
    `;

        res.setHeader('Content-Type', 'text/html');
        res.send(script);

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
