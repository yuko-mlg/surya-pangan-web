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

        // Safe script injection to avoid syntax errors
        const script = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authenticating...</title>
      </head>
      <body>
      <p>Authentication successful! You can close this window if it doesn't close automatically.</p>
      <script>
        (function() {
          try {
            var data = {
              token: "${token}",
              provider: "${providerStr}"
            };
            
            // Format: "authorization:<provider>:success:<json-data>"
            var msg = "authorization:" + data.provider + ":success:" + JSON.stringify(data);
            
            if (window.opener) {
              window.opener.postMessage(msg, "*");
              
              // Also send legacy format if relevant
              if (data.provider === "github") {
                 window.opener.postMessage("authorization:github:success:" + JSON.stringify(data), "*");
              }
              
              document.body.innerHTML += "<br>Message sent to CMS.";
              setTimeout(function() { window.close(); }, 1000);
            } else {
              document.body.innerHTML += "<br>Error: Cannot find the main window (opener). Please close this window and try again.";
            }
          } catch (err) {
             document.body.innerHTML += "<br>Error: " + err.message;
          }
        })()
      </script>
      </body>
      </html>
    `;

        res.setHeader('Content-Type', 'text/html');
        res.send(script);

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error: ' + error.message);
    }
}
