const express = require('express') 
const sqlite3 = require('sqlite3')
const { open }= require('sqlite')
const port = 3030; 

async function main() {
    const db = await open({
        filename: 'database.db',
        driver: sqlite3.Database,
    }); 

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
    
    const app = express() 
    app.use(express.json()) 
    
    app.get('/post', async (req, res) => {
        try {
            const result = await db.all('select id, nickname, title, content, createdDate, likeCount, viewCount from post')
            res.json({
                success: true, 
                code: 0, 
                message: '성공하였습니다', 
                data: result
            })
        } catch (e) {
            res.json({
                success: false, 
                code: -1, 
                message: e.message, 
                data: null, 
            })
        }
    });

    app.get('/post/:id', async (req, res) => {
        try {
            const result = await db.get(`
                select id, nickname, title, content, createdDate, likeCount, viewCount from post where id = ?
            `, req.params.id); 

            res.json({
                success: true, 
                code: 0, 
                message: '성공하였습니다', 
                data: result, 
            })
        }catch(e) {
            res.json({
                success: false, 
                code: -1, 
                message: e.message, 
                data: null, 
            })
        }
    })

    app.post('/post', async (req, res) => {
        try {
            const now = (new Date()).toISOString();
            const values = {
                ':nickname': req.body.nickname, 
                ':title': req.body.title, 
                ':content': req.body.content, 
                ':createdDate': now,
                ':likeCount': 0, 
                ':viewCount': 0
            }

            await db.run(`
                insert into post(nickname, title, content, createdDate, likeCount, viewCount) 
                values (:nickname, :title, :content, :createdDate, :likeCount, :viewCount)`, values); 
            
            res.json({
                success: true, 
                code: 0, 
                message: 'db 삽입 성공',
                data: {
                    nickname: values[':nickname'], 
                    title: values[':title'], 
                    content: values[':content'], 
                    createdDate: values[':createdDate'], 
                    likeCount: values[':likeCount'], 
                    viewCount: values[':viewCount'],
                },
            })
        } catch (e) {
            res.json({
                success: false, 
                code: -1, 
                message: e.message, 
                data: null, 
            })
        }
    });
    
    app.listen(port, () => console.log(`server is running on ${port}`))
}

main().then();
