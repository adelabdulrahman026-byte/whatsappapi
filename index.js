const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');

const app = express();
// السطر ده مهم جداً عشان السيرفر يقدر يقرأ البيانات اللي جياله من جوجل سكريبت
app.use(express.json());

const client = new Client({
    // السطر اللي جاي ده هو السحر اللي هيعمل جلسة جديدة ويتجاهل التعليقة القديمة
    authStrategy: new LocalAuth({ clientId: 'boda-api-session' }), 
    puppeteer: { 
        headless: true,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ] 
    }
});
let qrCodeImage = '';
let isClientReady = false;

// تحويل الكيو ار لصورة واضحة
client.on('qr', (qr) => {
    qrcode.toDataURL(qr, (err, url) => {
        if (!err) {
            qrCodeImage = url;
            console.log('الكيو ار جاهز، افتح الرابط الأساسي عشان تعمله مسح!');
        }
    });
});

// تأكيد الربط
client.on('ready', () => {
    isClientReady = true;
    console.log('تم الربط بنجاح! الواتساب جاهز يبعت رسايل ✅');
});

// 1. الرابط الأساسي لعرض الكيو ار كصورة
app.get('/', (req, res) => {
    if (isClientReady) {
        res.send('<h1 style="text-align:center; font-family:sans-serif; margin-top:50px; color:green;">الواتساب مربوط وشغال 100% ✅</h1>');
    } else if (qrCodeImage) {
        res.send(`
            <div style="text-align:center; font-family:sans-serif; margin-top:50px;">
                <h2>امسح الكيو ار كود ده من الواتساب للربط</h2>
                <img src="${qrCodeImage}" alt="QR Code" style="width:300px; height:300px; border:2px solid #ccc; padding:10px; border-radius:10px;">
            </div>
        `);
    } else {
        res.send('<h1 style="text-align:center; font-family:sans-serif; margin-top:50px;">جاري تحضير الكيو ار كود... اعمل ريفريش كمان ثواني</h1>');
    }
});

// 2. رابط الـ API المخصص لإرسال الرسائل
app.post('/send-message', async (req, res) => {
    // حماية: لو الواتساب مش مربوط، هيرد يقولك اربطه الأول بدل ما يضرب خطأ
    if (!isClientReady) {
        return res.status(503).json({ error: 'السيرفر شغال بس الواتساب لسه ممربوطش. افتح الرابط الأساسي واعمل مسح للكيو ار كود أولاً.' });
    }

    const { number, message } = req.body;
    
    try {
        await client.sendMessage(`${number}@c.us`, message);
        res.status(200).json({ status: 'Success', message: 'الرسالة اتبعتت بنجاح!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// تشغيل الواتساب
client.initialize();

// تشغيل السيرفر
// تشغيل السيرفر الأول وفتح الباب العام للإنترنت (0.0.0.0) عشان Render يلقطه فوراً
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`السيرفر الأساسي قام ومستعد على بورت ${port} 🚀`);
    
    // بعد ما السيرفر يقوم وRender يرضى عننا، نبدأ نشغل الواتساب براحتنا
    client.initialize();
});
