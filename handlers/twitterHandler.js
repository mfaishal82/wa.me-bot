const axios = require('axios');
const { API_BASE_URL } = require('../config/api');

async function handleTwitter(client, message) {
    try {
        const url = message.body;
        const apiUrl = `${API_BASE_URL}/downloader/twitter?url=${encodeURIComponent(url)}`;
        
        const response = await axios.get(apiUrl);
        const data = response.data;
        
        if (data.status && data.media && data.media.length > 0) {
            const videoUrl = data.media[0].url;
            await message.reply(`Silakan unduh video Twitter melalui link berikut:\n\n${videoUrl}`);
        } else {
            await message.reply('Maaf, tidak dapat menemukan video Twitter tersebut.');
        }
    } catch (error) {
        console.error('Error downloading Twitter video:', error);
        await message.reply('Maaf, terjadi kesalahan saat memproses video Twitter.');
    }
}

module.exports = handleTwitter; 