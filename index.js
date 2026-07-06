const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

const qrcode = require('qrcode'); // تأكد إنك ضفت المكتبة دي لو مش موجودة

client.on('qr', async (qr) => {
    // هيطبع رابط QR Code صغير ومضبوط على شكل صورة
    const qrImage = await qrcode.toDataURL(qr);
    console.log('--- افتح الرابط ده في المتصفح عشان تشوف الـ QR Code ---');
    console.log(qrImage); 
});

client.on('ready', () => {
    console.log('الواتساب بتاعك اتربط والـ API جاهز! ');
});

app.post('/send-message', async (req, res) => {
    const { number, message } = req.body;
    const chatId = `${number}@c.us`; 

    try {
        await client.sendMessage(chatId, message);
        res.status(200).send({ status: 'Success', message: 'الرسالة اتبعتت بنجاح!' });
    } catch (error) {
        res.status(500).send({ status: 'Error', error: error.message });
    }
});

client.initialize();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`السيرفر شغال دلوقتي على بورت ${port} 🚀`);
});
