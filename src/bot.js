require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const QRCode = require('qrcode');

// Load your bot token from environment variables
const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
    console.error("Please set your TELEGRAM_BOT_TOKEN in the .env file.");
    process.exit(1);
}

// Initialize the bot with polling (you can also use webhook for production environments)
const bot = new TelegramBot(token, { polling: true });

// Function to generate QR code as a data URL
async function generateQR(text) {
    try {
        return await QRCode.toDataURL(text);
    } catch (err) {
        console.error('Error generating QR code:', err);
        return null;
    }
}

// Listen for any message that contains the specific pattern for a Cashu token
bot.on('message', async (msg) => {
    if (msg.text && msg.text.includes('cashuA')) {
        const tokenRegex = /cashuA[\w+]{100,}/; // Adjust the regex according to your token format
        const matches = msg.text.match(tokenRegex);

        if (matches) {
            const cashuToken = matches[0];
            const qrCodeDataURL = await generateQR(cashuToken);

            if (qrCodeDataURL) {
                // Send the QR code as a photo
                bot.sendPhoto(msg.chat.id, qrCodeDataURL, {
                    caption: 'Here is the QR code for your Cashu token.'
                }).catch(error => {
                    console.error('Failed to send QR code:', error);
                });
            } else {
                bot.sendMessage(msg.chat.id, "Failed to generate QR code for the token.").catch(error => {
                    console.error('Failed to send message:', error);
                });
            }
        }
    }
});

// Handle errors
bot.on("polling_error", (error) => {
    console.error('Polling error:', error);
});

console.log("Bot has been started...");
