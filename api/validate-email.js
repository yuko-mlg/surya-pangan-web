const dns = require('dns');

module.exports = function (req, res) {
    // Enable CORS for flexibility (optional but good practice)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { email } = req.query;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email parameter' });
    }

    const domain = email.split('@')[1];

    dns.resolveMx(domain, (err, addresses) => {
        if (err || !addresses || addresses.length === 0) {
            // Domain has no MX records (cannot receive email)
            return res.status(200).json({ isValid: false, reason: 'no_mx_records' });
        }
        // Domain is valid
        return res.status(200).json({ isValid: true });
    });
};
