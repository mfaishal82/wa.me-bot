const axios = require('axios');
const rapid_api_key = process.env.rapid_api_key;

async function handleFacebook(message) {
    const facebookUrlPattern = /https?:\/\/(www\.)?facebook\.com\/.+/;
    const url = message.body.match(facebookUrlPattern)[0]; // Ekstrak URL Facebook
    const options = {
        method: 'GET',
        url: 'https://facebook-reel-and-video-downloader.p.rapidapi.com/app/main.php',
        params: { url: url },
        headers: {
            'x-rapidapi-key': rapid_api_key,
            'x-rapidapi-host': 'facebook-reel-and-video-downloader.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        if (response.data.success && response.data.links) {
            const preferredQualities = ['Download High Quality', 'Download Low Quality'];
            const videoData = preferredQualities.map(quality => response.data.links[quality]).find(url => url);

            if (videoData) {
                return `Video tersedia dalam kualitas ${preferredQualities.find(quality => response.data.links[quality])}. Anda dapat mengunduhnya di sini: ${videoData}`;
            } else {
                return 'Maaf, tidak dapat menemukan video dengan kualitas yang diinginkan.';
            }
        } else {
            return 'Maaf, tidak dapat menemukan video untuk URL yang diberikan.';
        }
    } catch (error) {
        console.error(error);
        return 'Terjadi kesalahan saat mencoba mengunduh video.';
    }
}

module.exports = handleFacebook;