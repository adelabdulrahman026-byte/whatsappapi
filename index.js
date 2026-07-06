const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');

const app = express();
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    }
});

let qrCodeData = 'جاري التحميل...';

client.on('qr', (qr) => {
    qrcode.toDataURL(qr, (err, url) => {
        qrCodeData = url;
    });
});

app.get('/', (req, res) => {
    if (qrCodeData.startsWith('data:image')) {
        res.send(`<h1>امسح الكود ده من الواتساب</h1><img src="${qrCodeData}">`);
    } else {
        res.send('<h1>جاري تحضير الكود، انتظر ثواني واعمل ريفريش للصفحة...</h1>');
    }
});

client.on('ready', () => console.log('تم الربط بنجاح!'));
client.initialize();
app.listen(process.env.PORT || 3000);
