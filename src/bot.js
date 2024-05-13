const TelegramBot = require('node-telegram-bot-api');
const QRCode = require('qrcode');
const token = 'YOUR_TELEGRAM_BOT_TOKEN'; // Replace YOUR_TELEGRAM_BOT_TOKEN with your actual bot token

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Regular expression to detect Cashu tokens in messages
const cashuTokenRegex = /(\bCashu[\w\d]+)\b/;

// Listen for any kind of message
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const { text } = msg;

  // Check if the message contains a Cashu token
  const match = text.match(cashuTokenRegex);
  if (match) {
    const cashuToken = match[0];
    // Generate a QR code for the Cashu token
    QRCode.toDataURL(cashuToken, async (err, url) => {
      if (err) {
        console.error('Error generating QR code:', err);
        return bot.sendMessage(chatId, 'Failed to generate QR code.');
      }
      
      // Send the QR code as a photo
      const qrMessage = await bot.sendPhoto(chatId, url, { caption: `Scan to claim: ${cashuToken}` });

      // Simulate a check for when the Cashu token is claimed (this should be replaced by actual logic)
      // This timeout is for demonstration. Replace it with actual token claim detection.
      setTimeout(async () => {
        // Once token is claimed, delete the QR code message
        await bot.deleteMessage(chatId, qrMessage.message_id);
        // Update the original message
        bot.editMessageText('Cashu token claimed ✅', { chat_id: chatId, message_id: msg.message_id });
      }, 60000); // simulate token claim after 60 seconds
    });
  }
});

// Error handling
bot.on('polling_error', (error) => {
  console.error('Polling error', error);
});

bot.on('webhook_error', (error) => {
  console.error('Webhook error', error);
});
