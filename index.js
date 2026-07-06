const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');

const app = express();
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

let qrData = null;

client.on('qr', (qr) => {
    qrcode.toDataURL(qr, (err, url) => {
        qrData = url;
    });
});

app.get('/', (req, res) => {
    if (qrData) {
        res.send(`<h1>مسح الكود ده للربط:</h1><img src="${qrData}">`);
    } else {
        res.send('<h1>جاري تحضير الكود... حدث الصفحة بعد لحظات</h1>');
    }
});

client.on('ready', () => console.log('تم الربط!'));
client.initialize();
app.listen(process.env.PORT || 3000);
