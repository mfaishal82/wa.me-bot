const axios = require('axios');
const { API_BASE_URL } = require('../config/api');

async function handlePixeldrain(client, message) {
    try {
        const url = message.body;
        const apiUrl = `${API_BASE_URL}/downloader/pixeldrain?url=${encodeURIComponent(url)}`;
        
        const response = await axios.get(apiUrl);
        const data = response.data;
        
        const replyMessage = `*File Pixeldrain ditemukan!*\n\n` +
            `📁 Nama File: ${data.filename}\n` +
            `📊 Ukuran: ${data.filesizeH}\n` +
            `📎 Tipe File: ${data.filetype}\n\n` +
            `🔗 Link Download:\n${data.url}`;
            
        await message.reply(replyMessage);
    } catch (error) {
        console.error('Error processing Pixeldrain:', error);
        await message.reply('Maaf, terjadi kesalahan saat memproses link Pixeldrain.');
    }
}

module.exports = handlePixeldrain; 