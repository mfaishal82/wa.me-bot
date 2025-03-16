const { MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');
const rapid_api_key = process.env.rapid_api_key;

async function handleFacebook(client, message) {
    const facebookUrlPattern = /https?:\/\/(www\.)?facebook\.com\/.+/;
    const url = message.body.match(facebookUrlPattern)[0];

    // Kirim pesan "sedang diproses" terlebih dahulu
    await message.reply('Permintaan sedang diproses. Harap Tunggu...');

    try {
        const response = await axios.get(`https://api.ryzendesu.vip/api/downloader/fbdl?url=${encodeURIComponent(url)}`);
        
        if (response.data.status && response.data.data) {
            const priorityOrder = ['480p', '360p', '720p'];
            let selectedVideo = null;

            for (const priority of priorityOrder) {
                const video = response.data.data.find(v => v.resolution.includes(priority));
                if (video) {
                    selectedVideo = video;
                    break;
                }
            }

            if (!selectedVideo && response.data.data.length > 0) {
                selectedVideo = response.data.data[0];
            }

            if (selectedVideo) {
                const videoUrl = selectedVideo.url;
                const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
                console.log('Video downloaded successfully. Size:', videoResponse.data.length);

                if (videoResponse.data.length > 16 * 1024 * 1024) {
                    await message.reply('Video terlalu besar. Silakan unduh langsung dari link ini: ' + videoUrl);
                    return;
                }

                const videoData = Buffer.from(videoResponse.data, 'binary').toString('base64');
                const media = new MessageMedia('video/mp4', videoData, `Video ${url} ${selectedVideo.resolution}.mp4`);

                await client.sendMessage(message.from, media, { 
                    caption: `Video Facebook (size ${selectedVideo.resolution}) dari ${url}`, 
                    sendMediaAsDocument: true 
                });
            } else {
                await message.reply('Maaf, tidak dapat menemukan video yang sesuai.');
            }
        } else {
            await message.reply('Maaf, tidak dapat mengunduh video dari URL yang diberikan.');
        }
    } catch (error) {
        console.error('Error:', error);
        await message.reply('Terjadi kesalahan saat mencoba mengunduh atau mengirim video.');
    }
}

module.exports = handleFacebook;