const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const app = express();

app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.initialize();

client.on('ready', () => console.log('Client is ready!'));

app.post('/send-message', async (req, res) => {
    const { number, message } = req.body;
    try {
        await client.sendMessage(`${number}@c.us`, message);
        res.send({ status: 'Success' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

app.get('/', (req, res) => res.send('API is running!'));

app.listen(process.env.PORT || 3000);
