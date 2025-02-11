const axios = require('axios');

async function handleHaiBot(message) {
    try {
        const response = await axios.get(`https://apidl.asepharyana.cloud/api/ai/claude?text=Jawab respon ini menggunakan bahasa Indonesia: ${message.body}`);
        return response.data.response;
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