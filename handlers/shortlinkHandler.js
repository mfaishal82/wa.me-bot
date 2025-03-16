const axios = require('axios');
const { API_BASE_URL } = require('../config/api');

async function handleShortlink(message) {
    try {
        // Ambil URL dari pesan (hapus command /short dan spasi)
        const url = message.body.slice(7).trim();
        
        if (!url) {
            return "Silakan masukkan URL yang ingin diperpendek setelah command /short";
        }

        const apiUrl = `${API_BASE_URL}/tool/tinyurl?url=${encodeURIComponent(url)}`;
        
        const response = await axios.get(apiUrl);
        const data = response.data;
        
        if (data.shortUrl) {
            return `✨ Link pendek berhasil dibuat!\n\n🔗 ${data.shortUrl}`;
        } else {
            return "Maaf, tidak dapat membuat shortlink untuk URL tersebut.";
        }
    } catch (error) {
        console.error('Error creating shortlink:', error);
        return "Maaf, terjadi kesalahan saat membuat shortlink.";
    }
}

module.exports = handleShortlink; 