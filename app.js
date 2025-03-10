require('dotenv').config();
const express = require('express');
const app = express();
// const port = process.env.PORT || 4000;
const port = 4000;
const { client } = require('./whatsappClient');
let isClientReady = false;

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'WA bot running normally 🏃‍♂️'
    })
});

client.once('ready', () => {
    isClientReady = true;
    console.log('Client is ready!');
});

app.post('/send-message', async (req, res) => {
    if (!isClientReady) {
        return res.status(503).json({ error: 'Client belum siap' });
    }
    
    const { number, message } = req.body;
    if (!number || !message) {
        return res.status(400).json({ error: 'Nomor dan pesan wajib diisi' });
    }

    try {
        // Format number to WhatsApp standard (628xx@s.whatsapp.net)
        const formattedNumber = number.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        const sentMsg = await client.sendMessage(formattedNumber, message);
        
        res.json({
            success: true,
            messageId: sentMsg.id._serialized,
            timestamp: sentMsg.timestamp
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Gagal mengirim pesan' });
    }
});

app.get('/get-groups', async (req, res) => {
    if (!isClientReady) {
        return res.status(503).json({ error: 'Client belum siap' });
    }
    
    try {
        const chats = await client.getChats();
        const groups = chats.filter(chat => chat.isGroup);
        
        res.json(groups.map(group => ({
            id: group.id._serialized,
            name: group.name,
            participants: group.participants.length
        })));
    } catch (error) {
        console.error('Error getting groups:', error);
        res.status(500).json({ error: 'Gagal mengambil daftar grup' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// WhatsApp client
require('./whatsappClient');