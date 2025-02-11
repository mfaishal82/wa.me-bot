const axios = require('axios');

async function handleInstagram(message) {
    const instagramUrlPattern = /https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[\w-]+/;
    const url = message.body.match(instagramUrlPattern)[0]; // Ekstrak URL Instagram
    const apiUrl = `https://api.ryzendesu.vip/api/downloader/igdl?url=${encodeURIComponent(url)}`;

    try {
        const response = await axios.get(apiUrl);
        // console.log('Response:', response.data);
        if (response.data.status && response.data.data.length > 0) {
            replyText = `Video yang anda minta tersedia. Anda dapat mengunduhnya di sini: ${response.data.data[0].url}`;
        } else {
            replyText = 'Maaf, tidak dapat menemukan konten untuk URL yang diberikan.';
        }
    } catch (error) {
        console.error(error);
        replyText = 'Terjadi kesalahan saat mencoba mengunduh konten.';
    }

    return replyText;
}

module.exports = handleInstagram;