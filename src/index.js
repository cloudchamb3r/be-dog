import express from 'express';
import postRouter from './routes/post-router.js';
import { db, db_init } from './database.js';

const port = 3030;
const app = express();

async function main() {
    await db_init();

    // sqlite does not have date type ;d
    await db.exec(`
        create table if not exists post ( 
            id integer primary key AUTOINCREMENT, 
            nickname varchar(100),
            title varchar(100), 
            content varchar(100), 
            createdDate varchar(100), 
            likeCount integer, 
            viewCount integer 
        )
    `);

    app.use(express.json());
    app.use('/post', postRouter);
    app.listen(port, () => console.log(`server is running on ${port}`));
}
main().then();

export default app; 