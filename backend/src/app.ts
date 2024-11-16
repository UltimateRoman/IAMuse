import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { initializeDatabase, insertGame, getGames, getGameFinalizedStatus } from './sql';
import cron from 'node-cron';
import axios from 'axios';
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

function scheduleApiCall(gameId: string) {

    cron.schedule('* * * * *', async () => {
        try {
                const isFinalized = await getGameFinalizedStatus(gameId);
                if (isFinalized) {
                    console.log(`Game ${gameId} is finalized. Stopping the scheduled task.`);
                    cron.getTasks().forEach(task => task.stop());
                    return;
                }
                else{
                    //proceed to call the agent
                    // await axios.post('http://example.com/another-api', { gameId: gameId });
                    console.log(`Called another API for gameId: ${gameId}`);    
                }
            }

        } catch (error) {
            console.error('Failed to call another API:', error);
        }
    }, {
        scheduled: true,
        timezone: "UTC"
    });
}

app.post('/createGame', (req, res) => {
    const { gameId } = req.body;
    console.log(req.body);
    const timestamp = new Date().toISOString();
    insertGame(gameId, timestamp);
    scheduleApiCall(gameId);
    res.json({ gameId: gameId });
});

export default app;
