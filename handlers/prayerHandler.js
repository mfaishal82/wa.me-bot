const axios = require('axios');
const { API_BASE_URL } = require('../config/api');

async function handlePrayerTimes(message) {
    const city = message.body.slice(6).trim();
    const apiUrl = `${API_BASE_URL}/search/jadwal-sholat?kota=${encodeURIComponent(city)}`;
    
    try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        if (data.total > 0) {
            const schedule = data.schedules[0].jadwal;
            return `Jadwal Sholat di ${data.schedules[0].lokasi}, ${data.schedules[0].daerah}:\n` +
                    `Tanggal: ${schedule.tanggal}\n` +
                    `Subuh: ${schedule.subuh}\n` +
                    `Terbit: ${schedule.terbit}\n` +
                    `Dhuha: ${schedule.dhuha}\n` +
                    `Dzuhur: ${schedule.dzuhur}\n` +
                    `Ashar: ${schedule.ashar}\n` +
                    `Maghrib: ${schedule.maghrib}\n` +
                    `Isya: ${schedule.isya}`;
        } else {
            return `Maaf, tidak ada jadwal sholat untuk kota ${city}.`;
        }
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        return 'Maaf, terjadi kesalahan saat mengambil jadwal sholat. Silakan coba lagi nanti.';
    }
}

module.exports = handlePrayerTimes;
