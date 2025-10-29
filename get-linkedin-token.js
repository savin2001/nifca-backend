// Helper script to get LinkedIn access token
// This creates a simple OAuth server to handle the LinkedIn callback

require('dotenv').config(); // Load .env file

const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3001; // Different from main app

// INSTRUCTIONS:
// 1. Make sure LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET are set in your .env file
// 2. Add http://localhost:3001/callback to your app's "Authorized redirect URLs" in LinkedIn App settings
// 3. Run: node get-linkedin-token.js
// 4. Open the URL shown in the console
// 5. Authorize the app
// 6. Copy the access token to your .env file

// Read LinkedIn credentials from environment variables
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3001/callback';

// Validate credentials are present
if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
  console.error('\n❌ ERROR: LinkedIn credentials not found in .env file!\n');
  console.error('Please make sure your .env file has:');
  console.error('  LINKEDIN_CLIENT_ID=your_client_id');
  console.error('  LINKEDIN_CLIENT_SECRET=your_client_secret\n');
  console.error('Uncomment these lines in your .env file if they are commented out.\n');
  process.exit(1);
}

// Scopes needed for posting
const SCOPES = ['openid', 'profile', 'w_member_social', 'email'];

// Step 1: Authorization URL
app.get('/', (req, res) => {
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code&` +
    `client_id=${LINKEDIN_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `scope=${encodeURIComponent(SCOPES.join(' '))}`;

  res.send(`
    <html>
      <head>
        <title>LinkedIn OAuth Helper</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
          .button {
            display: inline-block;
            background: #0077B5;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 18px;
          }
          .button:hover { background: #006399; }
          code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h1>🔗 LinkedIn OAuth Token Generator</h1>
        <p>This tool helps you get a LinkedIn access token for the NIFCA social media integration.</p>

        <h2>Before you start:</h2>
        <ol>
          <li>Make sure you've created a LinkedIn App at <a href="https://www.linkedin.com/developers/apps" target="_blank">LinkedIn Developers</a></li>
          <li>Your app must have the <strong>"Share on LinkedIn"</strong> product approved</li>
          <li>Add <code>http://localhost:3001/callback</code> to your app's "Authorized redirect URLs" in the Auth tab</li>
          <li>Update the credentials in this script (LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET)</li>
        </ol>

        <h2>Ready? Click below to authorize:</h2>
        <p>
          <a href="${authUrl}" class="button">Authorize with LinkedIn</a>
        </p>

        <h3>What happens next:</h3>
        <ul>
          <li>You'll be redirected to LinkedIn to authorize the app</li>
          <li>After authorization, you'll be redirected back here</li>
          <li>Your access token will be displayed (copy it to your .env file)</li>
        </ul>
      </body>
    </html>
  `);
});

// Step 2: Handle callback and exchange code for token
app.get('/callback', async (req, res) => {
  const { code, error, error_description } = req.query;

  if (error) {
    return res.send(`
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px;">
          <h1>❌ Authorization Failed</h1>
          <p><strong>Error:</strong> ${error}</p>
          <p><strong>Description:</strong> ${error_description}</p>
          <p><a href="/">Try again</a></p>
        </body>
      </html>
    `);
  }

  try {
    console.log('\n📝 Authorization code received:', code);
    console.log('🔄 Exchanging code for access token...\n');

    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, expires_in, scope } = tokenResponse.data;

    console.log('✅ Access token received!');
    console.log('Token expires in:', expires_in, 'seconds (', Math.floor(expires_in / 86400), 'days)');
    console.log('Scopes:', scope);
    console.log('\n📋 Copy this token to your .env file:\n');
    console.log('LINKEDIN_ACCESS_TOKEN=' + access_token);
    console.log('\n');

    res.send(`
      <html>
        <head>
          <title>LinkedIn Token - Success!</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            .token-box {
              background: #f4f4f4;
              padding: 20px;
              border-radius: 5px;
              border-left: 4px solid #0077B5;
              word-wrap: break-word;
              font-family: monospace;
              font-size: 14px;
            }
            .success { color: #00A859; }
            .warning {
              background: #fff3cd;
              padding: 15px;
              border-radius: 5px;
              border-left: 4px solid #ffc107;
              margin-top: 20px;
            }
            button {
              background: #0077B5;
              color: white;
              padding: 10px 20px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
              margin-top: 10px;
            }
            button:hover { background: #006399; }
          </style>
        </head>
        <body>
          <h1 class="success">✅ Success! Access Token Generated</h1>

          <h2>Your LinkedIn Access Token:</h2>
          <div class="token-box" id="tokenBox">
            LINKEDIN_ACCESS_TOKEN=${access_token}
          </div>
          <button onclick="copyToken()">📋 Copy to Clipboard</button>

          <div class="warning">
            <strong>⚠️ Important:</strong>
            <ul>
              <li>This token expires in <strong>${Math.floor(expires_in / 86400)} days</strong></li>
              <li>Add it to your <code>.env</code> file in the nifca-backend2 folder</li>
              <li>Also set <code>LINKEDIN_ENABLED=true</code> in your .env</li>
              <li>Restart your backend server after updating .env</li>
              <li>Keep this token secret - don't commit it to version control!</li>
            </ul>
          </div>

          <h2>Next steps:</h2>
          <ol>
            <li>Copy the token above</li>
            <li>Open <code>nifca-backend2/.env</code></li>
            <li>Set <code>LINKEDIN_ENABLED=true</code></li>
            <li>Add <code>LINKEDIN_CLIENT_ID=${LINKEDIN_CLIENT_ID}</code></li>
            <li>Add <code>LINKEDIN_CLIENT_SECRET=${LINKEDIN_CLIENT_SECRET}</code></li>
            <li>Add the <code>LINKEDIN_ACCESS_TOKEN</code> line you copied</li>
            <li>Restart your backend server</li>
            <li>Test posting news with LinkedIn enabled!</li>
          </ol>

          <p><em>You can close this window and stop the server (Ctrl+C in terminal)</em></p>

          <script>
            function copyToken() {
              const tokenText = document.getElementById('tokenBox').innerText;
              navigator.clipboard.writeText(tokenText).then(() => {
                alert('✅ Token copied to clipboard!');
              });
            }
          </script>
        </body>
      </html>
    `);

    // Auto-close server after 60 seconds
    setTimeout(() => {
      console.log('\n✅ Token generated successfully. Closing server...');
      process.exit(0);
    }, 60000);

  } catch (error) {
    console.error('❌ Error exchanging code for token:', error.response?.data || error.message);

    res.send(`
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px;">
          <h1>❌ Error Getting Access Token</h1>
          <p><strong>Error:</strong> ${error.message}</p>
          <pre style="background: #f4f4f4; padding: 15px; border-radius: 5px;">${JSON.stringify(error.response?.data || error, null, 2)}</pre>
          <p><a href="/">Try again</a></p>
        </body>
      </html>
    `);
  }
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 LinkedIn OAuth Helper Server Started!\n');
  console.log('📋 Setup Instructions:');
  console.log('1. Make sure you have updated LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET in this script');
  console.log('2. Add http://localhost:3001/callback to your LinkedIn App\'s redirect URLs');
  console.log('3. Open this URL in your browser:\n');
  console.log(`   👉 http://localhost:${PORT}\n`);
  console.log('Press Ctrl+C to stop the server\n');
});
