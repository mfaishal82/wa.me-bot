const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create a new client instance
const client = new Client({
    authStrategy: new LocalAuth()
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is ready!');
});

// When the client receives a QR-Code
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// Object to track processed messages
const processedMessages = new Set();

client.on('message', async (message) => {
    console.log(message.body);

    // Ignore messages sent by the bot itself
    if (message.fromMe) return;

    // Ignore messages from groups
    if (message.isGroupMsg) return;

    // Check if the message has already been processed
    if (processedMessages.has(message.id._serialized)) {
        return; // If already processed, ignore
    }

    // Mark the message as processed
    processedMessages.add(message.id._serialized);

    try {
        let replyText;
        if (message.body === 'Hello') {
            replyText = 'Hello! How can I assist you today?';
        } else if (message.body.toLowerCase() === 'how are you?') {
            replyText = 'I am just a bot, but I am here to help you!';
        } else if (message.body.toLowerCase() === "assalamu'alaikum") {
            replyText = "Wa'alaikumussalam! Ini adalah bot yang menjawab pesan otomatis";
        } else if (message.body.toLowerCase().startsWith('hi bot')) {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(message.body);
            const response = await result.response;
            replyText = response.text();
        } else {
            return; // If not starting with "Hi Bot", ignore
        }
        await message.reply(replyText);
        console.log(replyText)
    } catch (error) {
        console.error('Error details:', error);
        await message.reply('Sorry, I am unable to process your request at the moment. Please try again later.');
    }
});

// Start your client
client.initialize();