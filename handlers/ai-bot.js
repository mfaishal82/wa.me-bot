const axios = require('axios');
const { API_BASE_URL } = require('../config/api');

async function handleHaiBot(message) {
    try {
        const text = message.body.toLowerCase().startsWith('/bot') 
            ? message.body.slice(5).trim() 
            : message.body.slice(3).trim();

        const apiUrl = `${API_BASE_URL}/ai/deepseek?text=${encodeURIComponent(text)}&prompt=Hanya jawab menggunakan bahasa indonesia`;
        const response = await axios.get(apiUrl);
        return response.data.answer;
    } catch (error) {
        console.error(error);
        return 'Terjadi kesalahan saat mencoba mendapatkan respon.';
    }
}

const { Hercai } = require("hercai");
const herc = new Hercai();

async function handleDrawImage(message) {
    const prompt = message.body.slice(10).trim(); // Extract the prompt after 'draw image'
    const response = await herc.drawImage({ model: "v3", prompt: prompt, negative_prompt: "" });
    return `Here is your image: ${response.url}`;
}

module.exports = { handleHaiBot, handleDrawImage };