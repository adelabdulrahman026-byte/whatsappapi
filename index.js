const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    // الطريقة دي هي الأفضل للـ Logs عشان متطلعش عريضة
    console.log('QR RECEIVED, SCAN THIS:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

app.post('/send-message', async (req, res) => {
    const { number, message } = req.body;
    await client.sendMessage(`${number}@c.us`, message);
    res.send('Message sent');
});

client.initialize();
app.listen(process.env.PORT || 3000);
