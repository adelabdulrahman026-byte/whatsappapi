const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');

const app = express();
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

let qrCodeData = '';

client.on('qr', async (qr) => {
    qrCodeData = await qrcode.toDataURL(qr); // بيحول الـ QR لصورة واضحة
    console.log('QR جاهز، افتح الرابط أدناه!');
});

// صفحة ويب بسيطة بتعرض الـ QR كصورة  جداً
app.get('/', (req, res) => {
    if (qrCodeData) {
        res.send(`<h1>امسح الكود ده من الواتساب</h1><img src="${qrCodeData}">`);
    } else {
        res.send('جاري تحضير الكود، استنى ثانية واعمل ريفريش...');
    }
});

client.on('ready', () => console.log('تم الربط بنجاح!'));
client.initialize();
app.listen(process.env.PORT || 3000);
