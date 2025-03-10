const axios = require('axios');

async function handleYouTube(client, message) {
    const youtubeUrlPattern = /https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+|https?:\/\/youtu\.be\/[\w-]+/;
    const url = message.body.match(youtubeUrlPattern)[0];

    const options = {
        method: 'GET',
        url: 'https://youtube-video-audio-downloader.p.rapidapi.com/api/v1/youtube-media/info',
        params: { url: url },
        headers: {
            'x-rapidapi-key': process.env.rapid_api_key,
            'x-rapidapi-host': 'youtube-video-audio-downloader.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        
        if (response.data.status === 'success') {
            const videoLinks = response.data.data.links.filter(link => link.type === 'video');
            let selectedVideo = videoLinks.find(link => link.resolution === '780p');
            
            if (!selectedVideo) {
                selectedVideo = videoLinks.find(link => link.resolution === '360p');
            }

            if (selectedVideo) {
                const replyText = `*${response.data.data.title}*\n\nUploader: ${response.data.data.uploader}\nDurasi: ${response.data.data.duration}\nResolusi: ${selectedVideo.resolution}\n\nLink Download:\n${selectedVideo.download_url}`;
                await message.reply(replyText);
            } else {
                await message.reply('Maaf, tidak dapat menemukan video dengan kualitas yang diinginkan.');
            }
        } else {
            await message.reply('Maaf, tidak dapat memproses video YouTube tersebut.');
        }
    } catch (error) {
        console.error(error);
        await message.reply('Terjadi kesalahan saat mencoba mengunduh video.');
    }
}

module.exports = handleYouTube;