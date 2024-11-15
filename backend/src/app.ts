import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post('/createGame', (req:any, res:any) => {
    const { gameId } = req.body;

    console.log(req);
    // Process the data here

    res.send('Data received');
});


export default app;