# Social Media Integration Setup Guide

This guide explains how to set up and use the optional social media posting features for News, Press Releases, and Events.



● I can see a JWT token was received (user authenticated), but I don't see any Twitter posting logs     
  yet. This means either:

  1. The request didn't include post_to_twitter: true in the body
  2. The content creation endpoint wasn't called
  3. The logs might not be showing up yet

  Can you share the curl command or request you sent? Or let me wait a moment and check again:

● Bash(timeout 3 echo "Waiting for logs..." && sleep 3) timeout: 5s
  ⎿  Waiting for logs...
  ⎿  Session limit reached ∙ resets 12am
     /upgrade to increase your usage limit.



## Overview

The NIFCA backend now supports **optional** automatic posting to Twitter/X and LinkedIn when creating content. This feature:

- Is **completely optional** - disabled by default
- Has **zero performance impact** when disabled
- Posts asynchronously (non-blocking)
- Supports custom post formatting per content type
- Works independently per platform (can enable one or both)

## Prerequisites

### Twitter/X Setup

1. **Create a Twitter Developer Account**
   - Go to https://developer.twitter.com/
   - Apply for a developer account
   - Create a new app in the Developer Portal

2. **Get API Credentials**
   - Navigate to your app settings
   - Go to "Keys and Tokens"
   - Generate and save:
     - API Key (Consumer Key)
     - API Secret (Consumer Secret)
     - Access Token
     - Access Token Secret

3. **Set App Permissions**
   - Ensure your app has "Read and Write" permissions
   - You may need to regenerate tokens after changing permissions

### LinkedIn Setup

1. **Create a LinkedIn App**
   - Go to https://www.linkedin.com/developers/apps
   - Create a new app
   - Fill in required information

2. **Request API Access**
   - Request access to the "Share on LinkedIn" product
   - Wait for approval (may take a few days)

3. **Get API Credentials**
   - Navigate to your app settings
   - Go to "Auth" tab
   - Save:
     - Client ID
     - Client Secret

4. **Generate Access Token**
   - Use OAuth 2.0 flow to generate an access token
   - Alternatively, use the LinkedIn API testing tools
   - Save the access token securely

## Environment Variables

Add these variables to your `.env` file:

```bash
# Social Media Integration (Optional)

# Enable/Disable Features
TWITTER_ENABLED=false
LINKEDIN_ENABLED=false

# Twitter/X Credentials (only needed if TWITTER_ENABLED=true)
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_SECRET=your_access_secret_here

# LinkedIn Credentials (only needed if LINKEDIN_ENABLED=true)
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
LINKEDIN_ACCESS_TOKEN=your_access_token_here
```

### Enabling Social Media Features

To enable Twitter posting:
```bash
TWITTER_ENABLED=true
TWITTER_API_KEY=xyz123...
TWITTER_API_SECRET=abc456...
TWITTER_ACCESS_TOKEN=789def...
TWITTER_ACCESS_SECRET=ghi012...
```

To enable LinkedIn posting:
```bash
LINKEDIN_ENABLED=true
LINKEDIN_CLIENT_ID=xyz123...
LINKEDIN_CLIENT_SECRET=abc456...
LINKEDIN_ACCESS_TOKEN=your_long_access_token...
```

## Database Migration

Run the SQL migration to add social media fields to your database:

```bash
mysql -u your_username -p your_database < src/sql/social_media_migration.sql
```

Or manually execute the SQL file in your MySQL client.

This will add the following columns to `news`, `press_releases`, and `events` tables:
- `post_to_twitter` (BOOLEAN)
- `post_to_linkedin` (BOOLEAN)
- `twitter_post_id` (VARCHAR)
- `linkedin_post_id` (VARCHAR)
- `twitter_post_url` (TEXT)
- `linkedin_post_url` (TEXT)
- `social_media_posted_at` (TIMESTAMP)

## API Usage

### Creating News with Social Media Posting

**Endpoint:** `POST /api/auth/news`

**Request Body:**
```json
{
  "title": "Breaking News: NIFCA Launches New Initiative",
  "content": "Full article content goes here...",
  "picture": "https://example.com/image.jpg",
  "post_to_twitter": true,
  "post_to_linkedin": true
}
```

**Response:**
```json
{
  "message": "News created successfully",
  "newsId": 42,
  "picture": "/assets/news/nifca_news_abc12_42.jpg",
  "socialMediaQueued": true
}
```

### Creating Press Release with Social Media Posting

**Endpoint:** `POST /api/auth/press-releases`

**Request Body:**
```json
{
  "title": "NIFCA Announces Partnership",
  "content": "Press release content...",
  "release_date": "2025-10-15",
  "post_to_twitter": true,
  "post_to_linkedin": false
}
```

### Creating Event with Social Media Posting

**Endpoint:** `POST /api/auth/events`

**Request Body:**
```json
{
  "title": "Annual Finance Summit 2025",
  "description": "Join us for the biggest finance event of the year...",
  "event_start_date": "2025-11-20",
  "event_end_date": "2025-11-22",
  "location": "Nairobi International Convention Centre",
  "picture": "https://example.com/event.jpg",
  "post_to_twitter": true,
  "post_to_linkedin": true
}
```

## Post Formatting

### News Posts
```
📰 [Title]

[Content truncated to 200 chars]...

Read more: [FRONTEND_URL]/news/[id]
```

### Press Release Posts
```
📢 Press Release: [Title]

[Content truncated to 200 chars]...

Read more: [FRONTEND_URL]/press-releases/[id]
```

### Event Posts
```
📅 Upcoming Event: [Title]

📍 [Location]
📆 [Event Date]

[Description truncated to 150 chars]...

Details: [FRONTEND_URL]/events/[id]
```

## Character Limits

- **Twitter/X:** 280 characters (automatically truncated)
- **LinkedIn:** 3000 characters (automatically truncated)

## Error Handling

Social media posting is **non-blocking**:
- If posting fails, the content is still created successfully
- Errors are logged to the console
- The API response includes `socialMediaQueued: true` to indicate posting was attempted

Check server logs for social media posting results:
```
Social media posting results: {
  twitter: { success: true, platform: 'twitter', postId: '...' },
  linkedin: { success: true, platform: 'linkedin', postId: '...' }
}
```

## Testing

### Check Social Media Status

You can check if social media services are properly configured by checking the service status:

```javascript
const socialMediaService = require('./src/services/socialMediaService');
console.log(socialMediaService.getStatus());
```

Expected output when properly configured:
```json
{
  "twitter": {
    "enabled": true,
    "ready": true
  },
  "linkedin": {
    "enabled": true,
    "ready": true
  }
}
```

### Manual Test Posts

Create test content with social media posting enabled and monitor server logs for success/failure messages.

## Troubleshooting

### Twitter posting fails with "Unauthorized"
- Verify API credentials are correct
- Check app permissions are set to "Read and Write"
- Regenerate access tokens if needed

### LinkedIn posting fails
- Verify your app has "Share on LinkedIn" product access approved
- Check access token hasn't expired (LinkedIn tokens typically expire after 60 days)
- Regenerate access token if needed

### Posts not appearing
- Check server logs for error messages
- Verify `TWITTER_ENABLED` or `LINKEDIN_ENABLED` is set to `true`
- Confirm credentials are properly set in `.env`

### No performance impact when disabled
- When `TWITTER_ENABLED` and `LINKEDIN_ENABLED` are both `false`, the service initialization is skipped
- No API clients are created
- No network calls are made
- Zero overhead

## Security Best Practices

1. **Never commit `.env` file** to version control
2. **Rotate tokens regularly** (especially LinkedIn tokens)
3. **Use environment-specific credentials** (dev, staging, production)
4. **Monitor API usage** to stay within rate limits
5. **Store tokens securely** using environment variables, not hardcoded values

## Rate Limits

Be aware of platform rate limits:

- **Twitter/X:**
  - 300 posts per 3 hours (free tier)
  - 50 posts per 15 minutes (free tier)

- **LinkedIn:**
  - 100 posts per day per user
  - Check current limits at https://docs.microsoft.com/en-us/linkedin/

## Future Enhancements

Potential features to add:
- Scheduled posting (post at specific times)
- Post preview before publishing
- Edit/delete social media posts
- Post analytics/engagement tracking
- Support for additional platforms (Facebook, Instagram)
- Image posting support
- Hashtag management

## Support

For issues or questions:
1. Check server logs for detailed error messages
2. Verify credentials and environment variables
3. Consult platform-specific documentation:
   - Twitter API: https://developer.twitter.com/en/docs
   - LinkedIn API: https://docs.microsoft.com/en-us/linkedin/
