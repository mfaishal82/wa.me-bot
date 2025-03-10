const { MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');
const rapid_api_key = process.env.rapid_api_key;

async function handleFacebook(client, message) {
    const facebookUrlPattern = /https?:\/\/(www\.)?facebook\.com\/.+/;
    const url = message.body.match(facebookUrlPattern)[0];

    // Kirim pesan "sedang diproses" terlebih dahulu
    await message.reply('Permintaan sedang diproses. Harap Tunggu...');

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
            const videoUrl = preferredQualities.map(quality => response.data.links[quality]).find(url => url);

            if (videoUrl) {
                // Unduh video dari URL
                const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
                console.log('Video downloaded successfully. Size:', videoResponse.data.length);

                // Batasi ukuran file
                if (videoResponse.data.length > 16 * 1024 * 1024) { // 16 MB
                    await message.reply('Video terlalu besar. Silakan unduh langsung dari link ini: ' + videoUrl);
                    return;
                }

                const videoData = Buffer.from(videoResponse.data, 'binary').toString('base64');
                console.log('Video converted to base64.');

                // Buat objek MessageMedia
                const media = new MessageMedia('video/mp4', videoData, `Video ${message.body}.mp4`);
                console.log('MessageMedia created.');

                // Kirim video sebagai dokumen
                console.log('Attempting to send media...');
                await client.sendMessage(message.from, media, { caption: 'Ini adalah video yang Anda minta.', sendMediaAsDocument: true });
                console.log('Media sent successfully.');
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