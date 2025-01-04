const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { Hercai } = require("hercai");
const axios = require('axios');

const herc = new Hercai();

// Create a new client instance
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
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

// Tambahkan pola URL FB
const facebookUrlPattern = /https?:\/\/(www\.)?facebook\.com\/.+/;

// Tambahkan pola URL YouTube
const youtubeUrlPattern = /https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+|https?:\/\/youtu\.be\/[\w-]+/;

// Tambahkan pola URL Instagram
const instagramUrlPattern = /https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[\w-]+/;

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
    
    if (message.fromMe) return;
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
            replyText = "Wa'alaikumussalam! Ini adalah bot yang menjawab pesan otomatis";
        } else if (message.body.toLowerCase().startsWith('hai bot')) {
            const { reply } = await herc.question({
                model: "v3",
                content: message.body,
              });
            replyText = reply;
        } else if (message.body.toLowerCase().startsWith('draw image')) {
            const prompt = message.body.slice(10).trim(); // Extract the prompt after 'draw image'
            const response = await herc.drawImage({ model: "v3", prompt: prompt, negative_prompt: "" });
            replyText = `Here is your image: ${response.url}`;
        } else if (facebookUrlPattern.test(message.body)) {
            const url = message.body.match(facebookUrlPattern)[0]; // Ekstrak URL Facebook
            const apiUrl = `https://api.ryzendesu.vip/api/downloader/aiodown?url=${encodeURIComponent(url)}`;
            
            const response = await axios.get(apiUrl);
            if (response.data.success && response.data.quality.length > 0) {
                // Prioritaskan resolusi HD, lalu SD
                const preferredQualities = ['-hd', 'sd'];
                const videoData = response.data.quality.find(video => 
                    preferredQualities.includes(video.quality)
                );

                if (videoData) {
                    replyText = `Video tersedia dalam kualitas ${videoData.quality.toUpperCase()}. Anda dapat mengunduhnya di sini: ${videoData.url}`;
                } else {
                    replyText = 'Maaf, tidak dapat menemukan video dengan kualitas yang diinginkan.';
                }
            } else {
                replyText = 'Maaf, tidak dapat menemukan video untuk URL yang diberikan.';
            }
        } else if (youtubeUrlPattern.test(message.body)) {
            const url = message.body.match(youtubeUrlPattern)[0]; // Ekstrak URL YouTube
            const apiUrl = `https://api.ryzendesu.vip/api/downloader/ytmp4?url=${encodeURIComponent(url)}`;
            
            const response = await axios.get(apiUrl);
            if (response.data.url) {
                replyText = `Anda dapat mengunduh video YouTube di sini: ${response.data.url}`;
            } else {
                replyText = 'Maaf, tidak dapat menemukan video untuk URL yang diberikan.';
            }
        } else if (instagramUrlPattern.test(message.body)) {
            const url = message.body.match(instagramUrlPattern)[0]; // Ekstrak URL Instagram
            const apiUrl = `https://api.ryzendesu.vip/api/downloader/igdl?url=${encodeURIComponent(url)}`;
            
            const response = await axios.get(apiUrl);
            if (response.data.status && response.data.data.length > 0) {
                const videoData = response.data.data[0];
                replyText = `Video tersedia. Anda dapat mengunduhnya di sini: ${videoData.url}`;
            } else {
                replyText = 'Maaf, tidak dapat menemukan video untuk URL yang diberikan.';
            }
        } else {
            return; // If not starting with "Hi Bot" or "draw image", ignore
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
