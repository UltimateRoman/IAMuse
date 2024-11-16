import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { initializeDatabase, insertGame, getGames } from './sql';
const app = express();
const port = process.env.PORT || 3001;
app.use(cors());

app.use(bodyParser.json());

initializeDatabase();

app.get('/', (req, res) => {
  res.send('Hello are you amused?');
});

app.post('/createGame', (req, res) => {
  const { gameId } = req.body;
  console.log(req.body);
  const timestamp = new Date().toISOString();
  insertGame(gameId, timestamp);
  res.json({ gameId: gameId });
});

app.get('/games', async (req, res) => {
    try {
        const games = await getGames(); // Assuming getGames is a function that retrieves the list of games from the database
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve games' });
    }
});

export default app;
