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
      <p>Authentication successful! This window should close automatically.</p>
      <script>
        (function() {
          const token = "${token}";
          const provider = "${providerStr}" || "github";
          
          function sendToOpener(msg) {
            if (window.opener) {
              console.log("Sending to CMS:", msg);
              window.opener.postMessage(msg, "*");
            }
          }

          const data = { token: token, provider: provider };
          const successJSON = JSON.stringify(data);
          
          // Formats for different CMS versions
          const msgs = [
            "authorization:" + provider + ":success:" + successJSON,
            "authorization:github:success:" + successJSON, 
            successJSON
          ];

          function broadcast() {
            msgs.forEach(sendToOpener);
            // Also send as object for some specific versions/libraries
            if (window.opener) {
              window.opener.postMessage({
                type: "authorization:" + provider + ":success",
                payload: data
              }, "*");
              window.opener.postMessage({
                auth: data,
                status: "success"
              }, "*");
            }
          }

          // 1. Send all formats immediately
          broadcast();
          
          // 2. Respond to handshake requests
          window.addEventListener("message", function(e) {
            if (e.data === "authorizing:" + provider || e.data === "authorizing:github") {
              broadcast();
            }
          }, false);
          
          // 3. Signal readiness
          sendToOpener("authorizing:" + provider);
          sendToOpener("authorizing:github");

          // 4. Periodic retry (avoiding race conditions)
          let count = 0;
          const interval = setInterval(function() {
            broadcast();
            count++;
            if (count > 30) clearInterval(interval);
          }, 100);

          document.body.innerHTML += "<br>Status: Menghubungkan ke panel admin...";
          
          // Final delay before closing
          setTimeout(function() { 
            document.body.innerHTML += "<br>Berhasil! Menutup jendela...";
            setTimeout(function() { window.close(); }, 500);
          }, 1500);
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
