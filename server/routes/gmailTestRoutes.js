import express from 'express';
import { testGmailCredentials, generateAuthUrl, getSetupInstructions } from '../utils/gmailCredentialHelper.js';

const router = express.Router();

// Test Gmail credentials endpoint
router.get('/test-gmail', async (req, res) => {
  try {
    const result = await testGmailCredentials();
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        data: {
          emailAddress: result.emailAddress,
          accessToken: result.accessToken,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        hint: result.hint,
        setupUrl: '/gmail-setup',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to test Gmail credentials',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Gmail setup instructions endpoint
router.get('/gmail-setup', (req, res) => {
  const instructions = getSetupInstructions();
  
  // Return HTML page with setup instructions
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gmail API Setup Instructions</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f8f9fa;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2563eb;
            text-align: center;
            margin-bottom: 30px;
        }
        .step {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #2563eb;
        }
        .step h3 {
            color: #1f2937;
            margin-bottom: 15px;
        }
        .step ol, .step ul {
            margin-left: 20px;
        }
        .step li {
            margin-bottom: 8px;
        }
        .code {
            background: #1f2937;
            color: #10b981;
            padding: 15px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            margin: 10px 0;
            overflow-x: auto;
        }
        .warning {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .success {
            background: #d1fae5;
            border: 1px solid #10b981;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .btn {
            background: #2563eb;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin: 10px 5px;
            font-weight: 500;
        }
        .btn:hover {
            background: #1d4ed8;
        }
        .btn-success {
            background: #10b981;
        }
        .btn-success:hover {
            background: #059669;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📧 Gmail API Setup Instructions</h1>
        
        <div class="warning">
            <strong>⚠️ Current Issue:</strong> Your Gmail API credentials are invalid or expired. 
            Follow the steps below to fix this issue.
        </div>
        
        ${instructions.steps.map(step => `
            <div class="step">
                <h3>Step ${step.step}: ${step.title}</h3>
                <ol>
                    ${step.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                </ol>
            </div>
        `).join('')}
        
        <div class="step">
            <h3>Environment Variables Template</h3>
            <p>Add these to your <code>.env</code> file:</p>
            <div class="code">
CLIENT_ID=your_google_client_id_here
CLIENT_SECRET=your_google_client_secret_here
REFRESH_TOKEN=your_refresh_token_here
TO_EMAIL=your_destination_email@gmail.com
REDIRECT_URI=https://developers.google.com/oauthplayground
            </div>
        </div>
        
        <div class="step">
            <h3>🔧 Troubleshooting</h3>
            <ul>
                ${instructions.troubleshooting.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="https://console.cloud.google.com" class="btn" target="_blank">
                🌐 Google Cloud Console
            </a>
            <a href="https://developers.google.com/oauthplayground" class="btn" target="_blank">
                🔑 OAuth2 Playground
            </a>
            <a href="/test-gmail" class="btn btn-success">
                🧪 Test Credentials
            </a>
        </div>
        
        <div class="success">
            <strong>✅ After Setup:</strong> 
            <ol>
                <li>Update your .env file with the new credentials</li>
                <li>Restart your server</li>
                <li>Visit <a href="/test-gmail">/test-gmail</a> to verify the setup</li>
                <li>Try submitting a form to test email sending</li>
            </ol>
        </div>
    </div>
</body>
</html>
  `;
  
  res.send(html);
});

// Generate OAuth URL endpoint
router.get('/gmail-auth-url', (req, res) => {
  try {
    if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
      return res.status(400).json({
        success: false,
        error: 'CLIENT_ID and CLIENT_SECRET must be set first',
        hint: 'Please set up your Google Cloud Console credentials first'
      });
    }
    
    const authUrl = generateAuthUrl();
    
    res.json({
      success: true,
      message: 'OAuth2 authorization URL generated',
      authUrl,
      instructions: [
        '1. Click the authorization URL',
        '2. Sign in with your Gmail account',
        '3. Grant permissions',
        '4. Copy the authorization code',
        '5. Exchange it for a refresh token at OAuth2 Playground'
      ]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate auth URL',
      details: error.message
    });
  }
});

export default router;