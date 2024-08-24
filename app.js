require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Hello World!'
    })
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// WhatsApp client
require('./whatsappClient');