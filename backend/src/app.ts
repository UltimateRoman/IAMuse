import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post('/joingame', (req:any, res:any) => {
    const { ethAddress, cid, gameId } = req.body;

    if (typeof ethAddress !== 'string' || typeof cid !== 'string' || typeof gameId !== 'string') {
        return res.status(400).send('Invalid input');
    }
    console.log(req);
    // Process the data here

    res.send('Data received');
});

export default app;