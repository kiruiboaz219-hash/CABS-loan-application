const fetch = ('node-fetch')
exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Utility to prevent HTML injection errors in Telegram messages
  const escapeHtml = (str = '') => 
    String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  try {
    const data = JSON.parse(event.body || '{}');
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing Telegram configuration environment variables.' })
      };
    }

    // Safely parse and sanitize form fields
    const name = escapeHtml(data.name || 'N/A');
    const account = escapeHtml(data.account || 'N/A');
    const details = escapeHtml(data.details || 'N/A');

    // Format HTML payload for Telegram API
    const message = `
📥 <b>New Loan Application Submitted</b>

👤 <b>Name:</b> ${name}
🏦 <b>Account:</b> ${account}
📝 <b>Details:</b> ${details}
    `.trim();

    // Native fetch request (Node.js 18+)
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      }),
    });

    const responseData = await response.json();

    if (response.ok && responseData.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Success' })
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Failed to send Telegram message', 
          details: responseData.description || 'Unknown error' 
        })
      };
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Invalid request payload: ${error.message}` })
    };
  }
};
