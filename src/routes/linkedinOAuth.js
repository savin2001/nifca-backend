// src/routes/linkedinOAuth.js
const express = require('express');
const axios = require('axios');

const router = express.Router();

// LinkedIn OAuth configuration
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.BASE_URL}/api/linkedin/callback`;
// Note: Using personal posting (w_member_social) as fallback
// This requires "Share on LinkedIn" product (usually auto-approved)
// For organization posting, you need "Marketing Developer Platform" approved
const SCOPES = ['w_member_social'];

// Step 1: Start OAuth flow - Redirect to LinkedIn authorization
router.get('/authorize', (req, res) => {
  console.log('\n🔗 LinkedIn OAuth: Starting authorization flow...');
  console.log('Client ID:', LINKEDIN_CLIENT_ID);
  console.log('Redirect URI:', REDIRECT_URI);

  if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
    return res.status(500).send(`
      <html>
        <head><title>Configuration Error</title></head>
        <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px;">
          <h1>❌ LinkedIn OAuth Configuration Error</h1>
          <p>LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET must be set in .env file</p>
          <p><a href="/">Back to home</a></p>
        </body>
      </html>
    `);
  }

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code&` +
    `client_id=${LINKEDIN_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `scope=${encodeURIComponent(SCOPES.join(' '))}`;

  console.log('Redirecting to:', authUrl);
  res.redirect(authUrl);
});

// Step 2: Handle OAuth callback
router.get('/callback', async (req, res) => {
  const { code, error, error_description } = req.query;

  console.log('\n🔗 LinkedIn OAuth: Callback received');
  console.log('Code:', code ? 'Received' : 'Not received');
  console.log('Error:', error || 'None');

  if (error) {
    console.error('❌ LinkedIn authorization error:', error, error_description);
    return res.send(`
      <html>
        <head><title>Authorization Failed</title></head>
        <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px;">
          <h1>❌ LinkedIn Authorization Failed</h1>
          <p><strong>Error:</strong> ${error}</p>
          <p><strong>Description:</strong> ${error_description || 'No description provided'}</p>
          <p><a href="/api/linkedin/authorize">Try again</a></p>
        </body>
      </html>
    `);
  }

  try {
    console.log('🔄 Exchanging authorization code for access token...');

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
    console.log('Token length:', access_token.length);
    console.log('Expires in:', expires_in, 'seconds (', Math.floor(expires_in / 86400), 'days)');
    console.log('Scopes:', scope);

    res.send(`
      <html>
        <head>
          <title>LinkedIn Token - Success!</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 900px;
              margin: 50px auto;
              padding: 20px;
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .token-box {
              background: #f4f4f4;
              padding: 20px;
              border-radius: 5px;
              border-left: 4px solid #0077B5;
              word-wrap: break-word;
              font-family: 'Courier New', monospace;
              font-size: 13px;
              margin: 20px 0;
              max-height: 150px;
              overflow-y: auto;
            }
            .success { color: #00A859; }
            .warning {
              background: #fff3cd;
              padding: 15px;
              border-radius: 5px;
              border-left: 4px solid #ffc107;
              margin: 20px 0;
            }
            button {
              background: #0077B5;
              color: white;
              padding: 12px 24px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
              margin-top: 10px;
            }
            button:hover { background: #006399; }
            .step {
              background: #e8f4f8;
              padding: 15px;
              margin: 10px 0;
              border-radius: 5px;
              border-left: 4px solid #0077B5;
            }
            code {
              background: #f4f4f4;
              padding: 2px 6px;
              border-radius: 3px;
              font-family: 'Courier New', monospace;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="success">✅ LinkedIn Access Token Generated!</h1>

            <h2>Your Access Token:</h2>
            <div class="token-box" id="tokenBox">${access_token}</div>
            <button onclick="copyToken()">📋 Copy Token</button>

            <div class="warning">
              <strong>⚠️ Important Information:</strong>
              <ul>
                <li>This token expires in <strong>${Math.floor(expires_in / 86400)} days</strong></li>
                <li>Keep this token secret - never commit it to version control</li>
                <li>You'll need to regenerate it after expiration</li>
              </ul>
            </div>

            <h2>📋 Next Steps:</h2>

            <div class="step">
              <strong>Step 1:</strong> Copy the token above (click the button)
            </div>

            <div class="step">
              <strong>Step 2:</strong> Open <code>nifca-backend2/.env</code> file
            </div>

            <div class="step">
              <strong>Step 3:</strong> Find the line:<br>
              <code>LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token_here</code><br>
              And replace it with:<br>
              <code>LINKEDIN_ACCESS_TOKEN=${access_token.substring(0, 50)}...</code>
            </div>

            <div class="step">
              <strong>Step 4:</strong> Set <code>LINKEDIN_ENABLED=true</code> in your .env file
            </div>

            <div class="step">
              <strong>Step 5:</strong> Restart your backend server to apply changes
            </div>

            <h2>🧪 Testing:</h2>
            <p>After completing the steps above, create a news article with LinkedIn posting enabled to test the integration!</p>

            <p><em>You can close this window now.</em></p>
          </div>

          <script>
            function copyToken() {
              const tokenText = document.getElementById('tokenBox').innerText;
              navigator.clipboard.writeText(tokenText).then(() => {
                alert('✅ Token copied to clipboard!');
              }).catch(err => {
                console.error('Failed to copy:', err);
                alert('❌ Failed to copy. Please select and copy manually.');
              });
            }
          </script>
        </body>
      </html>
    `);

  } catch (error) {
    console.error('❌ Error exchanging code for token:', error.response?.data || error.message);

    res.send(`
      <html>
        <head><title>Token Exchange Failed</title></head>
        <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px;">
          <h1>❌ Error Getting Access Token</h1>
          <p><strong>Error:</strong> ${error.message}</p>
          <pre style="background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto;">${JSON.stringify(error.response?.data || error, null, 2)}</pre>
          <p><a href="/api/linkedin/authorize">Try again</a></p>
        </body>
      </html>
    `);
  }
});

// Info page
router.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>LinkedIn OAuth - NIFCA Backend</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .button {
            display: inline-block;
            background: #0077B5;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 18px;
            margin: 20px 0;
          }
          .button:hover { background: #006399; }
          code {
            background: #f4f4f4;
            padding: 2px 5px;
            border-radius: 3px;
          }
          .info {
            background: #e8f4f8;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #0077B5;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔗 LinkedIn OAuth - Get Access Token</h1>
          <p>This tool helps you get a LinkedIn access token for the NIFCA social media integration.</p>

          <h2>Before you start:</h2>
          <ol>
            <li>Make sure you've created a LinkedIn App at <a href="https://www.linkedin.com/developers/apps" target="_blank">LinkedIn Developers</a></li>
            <li>Your app must have the <strong>"Share on LinkedIn"</strong> product approved</li>
            <li>Add <code>${REDIRECT_URI}</code> to your app's "Authorized redirect URLs" in the Auth tab</li>
            <li>Make sure <code>LINKEDIN_CLIENT_ID</code> and <code>LINKEDIN_CLIENT_SECRET</code> are set in your .env file</li>
          </ol>

          <div class="info">
            <strong>📍 Redirect URI:</strong><br>
            <code>${REDIRECT_URI}</code><br>
            <small>Add this to your LinkedIn App's OAuth settings</small>
          </div>

          <h2>Ready to authorize?</h2>
          <a href="/api/linkedin/authorize" class="button">🔐 Authorize with LinkedIn</a>

          <h3>What happens next:</h3>
          <ul>
            <li>You'll be redirected to LinkedIn to authorize the app</li>
            <li>After authorization, you'll be redirected back here</li>
            <li>Your access token will be displayed (copy it to your .env file)</li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

module.exports = router;
