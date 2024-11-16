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

        } catch (error) {
            console.error('Failed to call another API:', error);
        }
    }, {
        scheduled: true,
        timezone: "UTC"
    });
}

app.post('/createGame', async (req, res) => {
    const { gameId } = req.body;
    console.log(req.body);

    const response = await axios.get('https://wapo-testnet.phala.network/ipfs/QmbhzgwFpD9gkbQSeaJW48LhAvttbgfZo4Shj7bFdzPKxA', {
        params: {
            key: '74c3bdd4d887d8d8',
            type: 'challenge'
        }
    });

    const game = response.data;
    

    const timestamp = new Date().toISOString();
    insertGame(game.gameId, timestamp);
    scheduleApiCall(game.gameId);
    res.json({ gameId: game.gameId });
});

export default app;
