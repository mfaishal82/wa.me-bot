const { MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');
const { API_BASE_URL } = require('../config/api');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendMediaWithRetry(client, message, media, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            await client.sendMessage(message.from, media, { 
                caption: 'Ini adalah video yang Anda minta.', 
                sendMediaAsDocument: true 
            });
            console.log('Media sent successfully.');
            return true;
        } catch (error) {
            console.log(`Attempt ${i + 1} failed:`, error.message);
            if (i < retries - 1) {
                console.log(`Waiting before retry...`);
                await sleep(2000); // Tunggu 2 detik sebelum mencoba lagi
            }
        }
    }
    return false;
}

async function handleFacebook(client, message) {
    const facebookUrlPattern = /https?:\/\/(www\.)?facebook\.com\/.+/;
    const url = message.body.match(facebookUrlPattern)[0];

    // Kirim pesan "sedang diproses" terlebih dahulu
    await message.reply('Permintaan sedang diproses. Harap Tunggu...');

    try {
        const response = await axios.get(`${API_BASE_URL}/downloader/fbdl`, {
            params: { url: url }
        });

        if (response.data.status && response.data.data) {
            const videoData = response.data.data.find(video => !video.shouldRender);
            
            if (videoData && videoData.url) {
                try {
                    const videoResponse = await axios.get(videoData.url, { 
                        responseType: 'arraybuffer',
                        timeout: 30000 // 30 detik timeout
                    });
                    console.log('Video downloaded successfully. Size:', videoResponse.data.length);

                    if (videoResponse.data.length > 16 * 1024 * 1024) {
                        await message.reply('Video terlalu besar. Silakan unduh langsung dari link ini: ' + videoData.url);
                        return;
                    }

                    const videoBuffer = Buffer.from(videoResponse.data, 'binary').toString('base64');
                    console.log('Video converted to base64.');

                    const media = new MessageMedia('video/mp4', videoBuffer, `Video_FB_${Date.now()}.mp4`);
                    console.log('MessageMedia created.');

                    console.log('Attempting to send media...');
                    const sendSuccess = await sendMediaWithRetry(client, message, media);
                    
                    if (!sendSuccess) {
                        // Jika semua percobaan gagal, kirim link sebagai fallback
                        await message.reply('Gagal mengirim video. Silakan unduh melalui link ini: ' + videoData.url);
                    }
                } catch (downloadError) {
                    console.error('Error downloading video:', downloadError);
                    await message.reply('Gagal mengunduh video. Silakan coba lagi nanti atau gunakan link ini: ' + videoData.url);
                }
            } else {
                await message.reply('Maaf, tidak dapat menemukan video dengan kualitas yang diinginkan.');
            }
        } else {
            await message.reply('Maaf, tidak dapat menemukan video untuk URL yang diberikan.');
        }
    } catch (error) {
        console.error('Error:', error);
        await message.reply('Terjadi kesalahan saat mencoba mengunduh atau mengirim video.');
    }
}

module.exports = handleFacebook;