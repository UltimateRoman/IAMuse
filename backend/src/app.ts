import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();
const port = process.env.PORT || 3001;
app.use(cors());

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post('/createGame', (req, res) => {
  const { gameId } = req.body;
  console.log(req.body);
  res.json({ gameId: gameId });
});

export default app;
