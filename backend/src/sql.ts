import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPromise = open({
  filename: './database.db',
  driver: sqlite3.Database
});

export async function initializeDatabase() {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gameId TEXT,
      gameCreateTime TEXT
    )
  `);
}

export async function insertGame(gameId: string, gameCreateTime: string) {
  const db = await dbPromise;
  await db.run('INSERT INTO games (gameId, gameCreateTime) VALUES (?, ?)', [gameId, gameCreateTime]);
}

export async function getGames() {
    const db = await dbPromise;
    const games = await db.all('SELECT * FROM games');
    return games;
}

