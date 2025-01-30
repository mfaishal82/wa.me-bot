const axios = require('axios');
const rapid_api_key = process.env.rapid_api_key;

async function handleInstagram(message) {
    const instagramUrlPattern = /https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[\w-]+/;
    const url = message.body.match(instagramUrlPattern)[0]; // Ekstrak URL Instagram
    const options = {
        method: 'GET',
        url: 'https://instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com/convert',
        params: { url: url },
        headers: {
            'x-rapidapi-key': rapid_api_key,
            'x-rapidapi-host': 'instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        // console.log(response.data);
        if (response.data.media) {
            replyText = `Video tersedia. Anda dapat mengunduhnya di sini: ${response.data.media[0].url}`;
        } else {
            replyText = 'Maaf, tidak dapat menemukan video untuk URL yang diberikan.';
        }
    } catch (error) {
        console.error(error);
        replyText = 'Terjadi kesalahan saat mencoba mengunduh video.';
    }
}

module.exports = handleInstagram;