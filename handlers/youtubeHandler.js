const axios = require('axios');

async function handleYouTube(message) {
    const youtubeUrlPattern = /https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+|https?:\/\/youtu\.be\/[\w-]+/;
    const url = message.body.match(youtubeUrlPattern)[0]; // Ekstrak URL YouTube
    const apiUrl = `https://api.ryzendesu.vip/api/downloader/y2mate?url=${encodeURIComponent(url)}`;

    try {
        const response = await axios.get(apiUrl);
        console.log(response.data.download.dl.mp4);
        if (response.data.download) {
            const preferredQualities = ['720p', '480p', '360p', '240p'];
            const videoData = preferredQualities.map(quality => response.data.download.dl.mp4[quality]).find(video => video && video.url);

            if (videoData) {
                replyText = `Video tersedia dalam kualitas ${preferredQualities.find(quality => response.data.download.dl.mp4[quality] && response.data.download.dl.mp4[quality].url)}. Anda dapat mengunduhnya di sini: ${videoData.url}`;
            } else {
                replyText = 'Maaf, tidak dapat menemukan video dengan kualitas yang diinginkan.';
            }
        } else {
            replyText = 'Maaf, tidak dapat menemukan video untuk URL yang diberikan.';
        }
    } catch (error) {
        console.error(error);
        replyText = 'Terjadi kesalahan saat mencoba mengunduh video.';
    }
}

module.exports = handleYouTube;