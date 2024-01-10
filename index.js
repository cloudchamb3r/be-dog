const express = require('express')
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const Mutex = require('async-mutex').Mutex
const port = 3030;

const __tx_mtx = new Mutex(); 
async function tx(promise) {
    let ret = undefined; 
    await __tx_mtx.acquire(); 
    try {
        ret = await promise();
    } catch(e) {
        throw e; 
    } finally {
        __tx_mtx.release();
    }
    return ret;
}

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

            if (!result) {
                throw new Error("id 에 해당하는 post 를 찾지 못했습니다")
            }
            res.json({
                success: true,
                code: 0,
                message: '성공하였습니다',
                data: result,
            })
        } catch (e) {
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

            const id = await tx(async() => {
                await db.run(`
                    insert into post(nickname, title, content, createdDate, likeCount, viewCount) 
                    values (:nickname, :title, :content, :createdDate, :likeCount, :viewCount)`, values);
                const { id } = await db.get('SELECT last_insert_rowid() as id')
                return id;
            });

            res.json({
                success: true,
                code: 0,
                message: 'db 삽입 성공',
                data: {
                    id,
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


    app.patch('/post', async (req, res) => {
        try {
            const values = {
                ':id': req.body.id,
                ':nickname': req.body.nickname,
                ':title': req.body.title,
                ':content': req.body.content,
                ':likeCount': req.body.likeCount,
                ':viewCount': req.body.viewCount,
            }

            const isString = (x) => (typeof x === 'string' || x instanceof String)
            const isNumber = (x) => (typeof x === 'number' || x instanceof Number)

            const activated = []
            if (isString(req.body.nickname)) {
                activated.push('nickname = :nickname')
            }
            if (isString(req.body.title)) {
                activated.push('title = :title')
            }
            if (isString(req.body.content)) {
                activated.push('content = :content')
            }
            if (isNumber(req.body.likeCount)) {
                activated.push('likeCount = :likeCount')
            }
            if (isNumber(req.body.viewCount)) {
                activated.push('viewCount = :viewCount')
            }

            const { changes } = await db.run(`
                update post 
                set 
                    ${activated.join(', ')}
                where id = :id
            `, values);
            if (changes == 0) {
                throw new Error('id 에 해당하는 요소를 찾지 못했습니다')
            }
            res.json({
                success: true,
                code: 0,
                message: 'db 수정 성공',
                data: {
                    id: values[':id'],
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

    app.delete('/post/:id', async (req, res) => {
        try {
            const { changes } = await db.run(`
                delete from post 
                where id = ?
            `, req.params.id);
            if (changes == 0) {
                throw new Error('id 에 해당하는 요소를 찾지 못했습니다')
            }
            res.json({
                success: true,
                code: 0,
                message: '삭제 성공',
                data: {
                    id: req.params.id
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

    app.post('/post/:id/view', async (req, res) => {
        try {
            const changes = await tx(async() => {
                const { viewCount: lastViewCount } = await db.get(`select viewCount from post where id = ?`, req.params.id);
                const { changes } = await db.run(`update post set viewCount = ? where id = ?`, lastViewCount + 1, req.params.id);
                return changes;
            }); 
            if (changes == 0) {
                throw new Error("조회에 실패하였습니다")
            }
            res.json({
                sucess: true,
                code: 0,
                message: '조회 성공',
                data: null,
            });

        } catch (e) {
            res.json({
                success: false,
                code: -1,
                message: e.message,
                data: null,
            })
        }
    });

    app.post('/post/:id/like', async (req, res) => {
        try {            
            const changes = await tx(async ()=>{
                const { likeCount: lastLikeCount } = await db.get(`select likeCount from post where id = ?`, req.params.id);
                const { changes } = await db.run(`update post set likeCount = ? where id = ?`, lastLikeCount + 1, req.params.id);
                return changes;
            }); 

            if (changes == 0) {
                throw new Error("좋아요에 실패하였습니다");
            }
            res.json({
                success: true,
                code: 0,
                message: '좋아요 성공',
                data: null,
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
