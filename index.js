const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // التعديل الأول للسيرفرات
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('اعمل مسح للـ QR Code ده من موبايلك...');
});

client.on('ready', () => {
    console.log('الواتساب بتاعك اتربط والـ API جاهز! ✅');
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

// التعديل التاني عشان السيرفر يختار البورت المناسب
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`السيرفر شغال دلوقتي على بورت ${port} 🚀`);
});