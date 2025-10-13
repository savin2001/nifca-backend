// src/services/socialMediaService.js
const { TwitterApi } = require('twitter-api-v2');
const { LinkedInApi } = require('linkedin-api-client');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

class SocialMediaService {
  constructor() {
    console.log('=== Social Media Service Initialization ===');

    // Twitter/X Configuration
    this.twitterEnabled = process.env.TWITTER_ENABLED === 'true';
    console.log(`Twitter Enabled (env): ${process.env.TWITTER_ENABLED}`);
    console.log(`Twitter Enabled (parsed): ${this.twitterEnabled}`);
    this.twitterClient = null;

    // LinkedIn Configuration
    this.linkedinEnabled = process.env.LINKEDIN_ENABLED === 'true';
    console.log(`LinkedIn Enabled (env): ${process.env.LINKEDIN_ENABLED}`);
    console.log(`LinkedIn Enabled (parsed): ${this.linkedinEnabled}`);
    this.linkedinClient = null;

    // Lazy initialization - only create clients when needed
    if (this.twitterEnabled) {
      console.log('Initializing Twitter client...');
      this.initTwitter();
    } else {
      console.log('Twitter is DISABLED - skipping initialization');
    }

    if (this.linkedinEnabled) {
      console.log('Initializing LinkedIn client...');
      this.initLinkedIn();
    } else {
      console.log('LinkedIn is DISABLED - skipping initialization');
    }

    console.log('=== Social Media Service Ready ===\n');
  }

  initTwitter() {
    try {
      console.log('--- Twitter Initialization ---');
      const appKey = process.env.TWITTER_API_KEY;
      const appSecret = process.env.TWITTER_API_SECRET;
      const accessToken = process.env.TWITTER_ACCESS_TOKEN;
      const accessSecret = process.env.TWITTER_ACCESS_SECRET;

      console.log(`Twitter API Key: ${appKey ? '✓ Present (length: ' + appKey.length + ')' : '✗ MISSING'}`);
      console.log(`Twitter API Secret: ${appSecret ? '✓ Present (length: ' + appSecret.length + ')' : '✗ MISSING'}`);
      console.log(`Twitter Access Token: ${accessToken ? '✓ Present (length: ' + accessToken.length + ')' : '✗ MISSING'}`);
      console.log(`Twitter Access Secret: ${accessSecret ? '✓ Present (length: ' + accessSecret.length + ')' : '✗ MISSING'}`);

      if (!appKey || !appSecret || !accessToken || !accessSecret) {
        console.error('❌ Twitter credentials INCOMPLETE - Twitter posting DISABLED');
        this.twitterEnabled = false;
        return;
      }

      this.twitterClient = new TwitterApi({
        appKey,
        appSecret,
        accessToken,
        accessSecret,
      });

      console.log('✅ Twitter client initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Twitter client:', error.message);
      console.error('Error stack:', error.stack);
      this.twitterEnabled = false;
    }
  }

  initLinkedIn() {
    try {
      const clientId = process.env.LINKEDIN_CLIENT_ID;
      const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
      const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;

      if (!clientId || !clientSecret || !accessToken) {
        console.warn('LinkedIn credentials missing. LinkedIn posting disabled.');
        this.linkedinEnabled = false;
        return;
      }

      this.linkedinClient = new LinkedInApi({
        clientId,
        clientSecret,
        accessToken,
      });

      console.log('LinkedIn client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize LinkedIn client:', error.message);
      this.linkedinEnabled = false;
    }
  }

  /**
   * Format content for social media post
   * @param {string} type - Content type: 'news', 'press_release', 'event'
   * @param {object} content - Content object with title, description, etc.
   * @returns {string} Formatted post text
   */
  formatPost(type, content) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    let postText = '';

    switch (type) {
      case 'news':
        postText = `📰 ${content.title}\n\n${this.truncateText(content.content, 200)}\n\nRead more: ${baseUrl}/news/${content.id}`;
        break;
      case 'press_release':
        postText = `📢 Press Release: ${content.title}\n\n${this.truncateText(content.content, 200)}\n\nRead more: ${baseUrl}/press-releases/${content.id}`;
        break;
      case 'event':
        const eventDate = new Date(content.event_start_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        postText = `📅 Upcoming Event: ${content.title}\n\n📍 ${content.location}\n📆 ${eventDate}\n\n${this.truncateText(content.description, 150)}\n\nDetails: ${baseUrl}/events/${content.id}`;
        break;
      default:
        postText = content.title;
    }

    return postText;
  }

  /**
   * Truncate text and add ellipsis
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated text
   */
  truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }

  /**
   * Download or read image file
   * @param {string} imagePath - URL or file path
   * @returns {Promise<Buffer|null>} Image buffer or null
   */
  async getImageBuffer(imagePath) {
    try {
      if (!imagePath) return null;

      // Check if it's a URL
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        const response = await axios.get(imagePath, { responseType: 'arraybuffer' });
        return Buffer.from(response.data);
      }

      // Check if it's a local file path (starts with /assets/)
      if (imagePath.startsWith('/assets/')) {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
          return fs.readFileSync(fullPath);
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting image buffer:', error.message);
      return null;
    }
  }

  /**
   * Upload image to Twitter
   * @param {Buffer} imageBuffer - Image buffer
   * @returns {Promise<string|null>} Media ID or null
   */
  async uploadImageToTwitter(imageBuffer) {
    try {
      if (!imageBuffer || !this.twitterClient) return null;

      const mediaId = await this.twitterClient.v1.uploadMedia(imageBuffer, {
        mimeType: 'image/jpeg',
      });

      console.log(`Image uploaded to Twitter: ${mediaId}`);
      return mediaId;
    } catch (error) {
      console.error('Error uploading image to Twitter:', error.message);
      return null;
    }
  }

  /**
   * Upload image to LinkedIn
   * @param {Buffer} imageBuffer - Image buffer
   * @returns {Promise<string|null>} Asset URN or null
   */
  async uploadImageToLinkedIn(imageBuffer) {
    try {
      if (!imageBuffer || !this.linkedinClient) return null;

      // LinkedIn image upload is more complex and requires multiple steps
      // For now, we'll return null and post text-only
      // Full implementation would require:
      // 1. Register upload
      // 2. Upload binary
      // 3. Get asset URN

      console.log('LinkedIn image upload not yet implemented, posting text-only');
      return null;
    } catch (error) {
      console.error('Error uploading image to LinkedIn:', error.message);
      return null;
    }
  }

  /**
   * Post to Twitter/X
   * @param {string} type - Content type
   * @param {object} content - Content object
   * @returns {Promise<object|null>} Tweet object or null
   */
  async postToTwitter(type, content) {
    console.log('\n🐦 === Attempting Twitter Post ===');
    console.log(`Twitter Enabled: ${this.twitterEnabled}`);
    console.log(`Twitter Client Ready: ${!!this.twitterClient}`);

    if (!this.twitterEnabled || !this.twitterClient) {
      console.log('❌ Twitter posting is DISABLED (not enabled or client not initialized)');
      return null;
    }

    try {
      console.log(`Content Type: ${type}`);
      console.log(`Content ID: ${content.id}`);
      console.log(`Content Title: ${content.title}`);
      console.log(`Has Picture: ${!!content.picture}`);

      const postText = this.formatPost(type, content);
      console.log(`Generated Post Text (${postText.length} chars): ${postText.substring(0, 100)}...`);

      // Twitter character limit is 280
      const tweetText = postText.length > 280 ? this.truncateText(postText, 277) : postText;
      console.log(`Final Tweet Text (${tweetText.length} chars): ${tweetText}`);

      // Try to upload image if available
      let mediaId = null;
      if (content.picture) {
        console.log(`📷 Image URL/Path: ${content.picture}`);
        const imageBuffer = await this.getImageBuffer(content.picture);
        if (imageBuffer) {
          console.log(`✓ Image buffer loaded (${imageBuffer.length} bytes)`);
          mediaId = await this.uploadImageToTwitter(imageBuffer);
          console.log(`Media ID: ${mediaId || 'FAILED'}`);
        } else {
          console.log('✗ Failed to load image buffer');
        }
      }

      // Create tweet with or without media
      const tweetOptions = { text: tweetText };
      if (mediaId) {
        tweetOptions.media = { media_ids: [mediaId] };
        console.log('Tweet will include image');
      }

      console.log('🚀 Posting tweet to Twitter API...');
      const tweet = await this.twitterClient.v2.tweet(tweetOptions);

      console.log(`✅ Successfully posted to Twitter!`);
      console.log(`Tweet ID: ${tweet.data.id}`);
      console.log(`Tweet URL: https://twitter.com/user/status/${tweet.data.id}`);
      console.log(`Has Image: ${!!mediaId}`);

      return {
        success: true,
        platform: 'twitter',
        postId: tweet.data.id,
        url: `https://twitter.com/user/status/${tweet.data.id}`,
        hasImage: !!mediaId
      };
    } catch (error) {
      console.error('❌ Failed to post to Twitter!');
      console.error('Error Message:', error.message);
      console.error('Error Code:', error.code);
      console.error('Error Details:', JSON.stringify(error, null, 2));
      return {
        success: false,
        platform: 'twitter',
        error: error.message
      };
    }
  }

  /**
   * Post to LinkedIn
   * @param {string} type - Content type
   * @param {object} content - Content object
   * @returns {Promise<object|null>} LinkedIn post object or null
   */
  async postToLinkedIn(type, content) {
    if (!this.linkedinEnabled || !this.linkedinClient) {
      console.log('LinkedIn posting is disabled');
      return null;
    }

    try {
      const postText = this.formatPost(type, content);

      // LinkedIn allows longer posts (3000 characters)
      const linkedInText = postText.length > 3000 ? this.truncateText(postText, 2997) : postText;

      const post = await this.linkedinClient.createPost({
        text: linkedInText,
        visibility: 'PUBLIC'
      });

      console.log(`Successfully posted to LinkedIn: ${post.id}`);
      return {
        success: true,
        platform: 'linkedin',
        postId: post.id,
        url: post.url || null
      };
    } catch (error) {
      console.error('Failed to post to LinkedIn:', error.message);
      return {
        success: false,
        platform: 'linkedin',
        error: error.message
      };
    }
  }

  /**
   * Post to all enabled platforms
   * @param {string} type - Content type
   * @param {object} content - Content object
   * @param {object} options - Posting options {twitter: boolean, linkedin: boolean}
   * @returns {Promise<object>} Results from all platforms
   */
  async postToSocialMedia(type, content, options = {}) {
    const results = {
      twitter: null,
      linkedin: null
    };

    // Post to Twitter if enabled and requested
    if (options.twitter && this.twitterEnabled) {
      results.twitter = await this.postToTwitter(type, content);
    }

    // Post to LinkedIn if enabled and requested
    if (options.linkedin && this.linkedinEnabled) {
      results.linkedin = await this.postToLinkedIn(type, content);
    }

    return results;
  }

  /**
   * Check if social media posting is available
   * @returns {object} Status of each platform
   */
  getStatus() {
    return {
      twitter: {
        enabled: this.twitterEnabled,
        ready: this.twitterClient !== null
      },
      linkedin: {
        enabled: this.linkedinEnabled,
        ready: this.linkedinClient !== null
      }
    };
  }
}

// Export singleton instance
module.exports = new SocialMediaService();
