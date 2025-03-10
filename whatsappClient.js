const { Client, LocalAuth, MessageMedia  } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { Hercai } = require("hercai");
const axios = require('axios');
const { handleHaiBot, handleDrawImage } = require('./handlers/ai-bot');
const handleFacebook = require('./handlers/facebookHandler');
const handleYouTube = require('./handlers/youtubeHandler');
const handleInstagram = require('./handlers/instagramHandler');
const herc = new Hercai();

const facebookUrlPattern = /https?:\/\/(www\.)?facebook\.com\/.+/;
const youtubeUrlPattern = /https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+|https?:\/\/youtu\.be\/[\w-]+/;
const instagramUrlPattern = /https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[\w-]+/;

// Create a new client instance
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage', // Mengatasi masalah memori di Heroku
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // Mengurangi penggunaan memori
            '--disable-gpu'
        ],
        headless: true // Pastikan mode headless aktif
    }
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
    const isGroupMsg = message.from.endsWith('@g.us');
    
    // Hanya tampilkan console.log jika bukan pesan grup
    if (!isGroupMsg) {
        console.log('Message type:', {
            isGroup: isGroupMsg,
            from: message.from,
            body: message.body
        });
    }
    
    if (isGroupMsg) return;
    
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
        } else if (message.body.toLowerCase() === "assalamu'alaikum" || message.body.toLowerCase() === "assalamualaikum" || message.body.toLowerCase() === "assalamualaikum warahmatullahi wabarakatuh") {
            replyText = "Wa'alaikumussalam! Ini adalah bot AI yang menjawab pesan otomatis";
        } else if (message.body.toLowerCase().startsWith('hai bot' || 'hi bot' || 'halo bot')) {
            replyText = await handleHaiBot(message);
        } else if (message.body.toLowerCase().startsWith('draw image' || 'buatkan gambar')) {
            const { Hercai } = require("hercai");
            const herc = new Hercai();

            async function handleDrawImage(message) {
                const prompt = message.body.slice(10).trim(); // Extract the prompt after 'draw image'
                const response = await herc.drawImage({ model: "v3", prompt: prompt, negative_prompt: "" });
                return `Here is your image: ${response.url}`;
            }
            replyText = await handleDrawImage(message);
        } else if (facebookUrlPattern.test(message.body)) {
            await handleFacebook(client, message);
            return
        } else if (youtubeUrlPattern.test(message.body)) {
            await handleYouTube(client, message)
            return
        } else if (instagramUrlPattern.test(message.body)) {
            replyText = await handleInstagram(message)
        } else {
            return;
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

module.exports.client = client;