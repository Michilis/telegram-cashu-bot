const TelegramBot = require('node-telegram-bot-api');
const qr = require('qrcode');
const dotenv = require('dotenv');
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN; // Ensure you have your bot token in .env file
const bot = new TelegramBot(token, { polling: { interval: 50000 } });

// Respond to being added to a group chat
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // Check if the bot is added to the group
  if (msg.new_chat_members) {
    const newMembers = msg.new_chat_members;
    newMembers.forEach(member => {
      if (member.id === bot.botId) {
        bot.sendMessage(chatId, "Make me an admin to let me update Cashu tokens.");
      }
    });
  }

  // Detect messages containing Cashu tokens and generate QR codes
  if (msg.text && msg.text.includes('Cashu token:')) {
    const tokenText = msg.text.split('Cashu token:')[1].trim();
    qr.toDataURL(tokenText, { errorCorrectionLevel: 'H' }, function (err, url) {
      if (err) return console.error(err);
      
      bot.sendPhoto(chatId, url, { caption: "Scan this QR to claim the Cashu token!" }).then((sentMsg) => {
        // Mock claim check (in a real scenario, this should be replaced with actual validation logic)
        setTimeout(() => {
          bot.deleteMessage(chatId, sentMsg.message_id);
          bot.editMessageText("Cashu... Cashu claimed ✅", { chat_id: chatId, message_id: msg.message_id });
        }, 5000); // Mock delay before the token is claimed
      });
    });
  }
});

// Command to manually confirm admin status
bot.onText(/\/confirm_admin/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Let the Cashu party begin 🎉");
});

// Error handling
bot.on('polling_error', (error) => {
  console.log(error); // Log polling errors
});
