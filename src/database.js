import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db = undefined;

async function db_init() {
    db = await open({
        filename: 'database.db',
        driver: sqlite3.Database,
    });
}

export { db, db_init }; 