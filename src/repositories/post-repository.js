import { db } from "../database.js";
import { atomic } from "../util/atomic.js";
import { isString, isNumber } from '../util/validator.js';

export default {
    getAllPost() {
        return db.all('select id, nickname, title, content, createdDate, likeCount, viewCount, img from post');
    },
    async getPostById(id) {
        const result = await db.get(`select id, nickname, title, content, createdDate, likeCount, viewCount, img from post where id = ?`, id);
        if (!result) {
            throw new Error("id 에 해당하는 post 를 찾지 못했습니다");
        }
        return result;
    },
    insertPost(postDto) {
        return atomic(async () => {
            await db.run(`
            insert into post(nickname, title, content, createdDate, likeCount, viewCount, img) 
            values (:nickname, :title, :content, :createdDate, :likeCount, :viewCount, :img)`, postDto.toSqliteParam());

            const { id } = await db.get('SELECT last_insert_rowid() as id');
            return {
                ...postDto,
                id,
            };
        });
    },
    async updatePost(postDto) {
        const activated = [];
        if (isString(postDto.nickname)) {
            activated.push('nickname = :nickname');
        }
        if (isString(postDto.title)) {
            activated.push('title = :title');
        }
        if (isString(postDto.content)) {
            activated.push('content = :content');
        }
        if (isNumber(postDto.likeCount)) {
            activated.push('likeCount = :likeCount');
        }
        if (isNumber(postDto.viewCount)) {
            activated.push('viewCount = :viewCount');
        }
        if (isString(postDto.img)) {
            activated.push('img = :img');
        }
        const { changes } = await db.run(`
                update post 
                set 
                    ${activated.join(', ')}
                where id = :id
            `, postDto.toSqliteParam());
        if (changes == 0) {
            throw new Error('id 에 해당하는 요소를 찾지 못했습니다');
        }
        return this.getPostById(postDto.id);
    },
    async deletePostById(id) {
        const { changes } = await db.run(`delete from post where id = ?`, id);
        if (changes == 0) {
            throw new Error('id 에 해당하는 요소를 찾지 못했습니다');
        }
        return id;
    },
    viewPostById(id) {
        return atomic(async () => {
            const { viewCount: lastViewCount } = await db.get(`select viewCount from post where id = ?`, id);
            const { changes } = await db.run(`update post set viewCount = ? where id = ?`, lastViewCount + 1, id);
            if (changes == 0) {
                throw new Error("조회에 실패하였습니다");
            }
            return this.getPostById(id);
        });
    },
    async likePostById(id) {
        return atomic(async () => {
            const { likeCount: lastLikeCount } = await db.get(`select likeCount from post where id = ?`, id);
            const { changes } = await db.run(`update post set likeCount = ? where id = ?`, lastLikeCount + 1, id);
            if (changes == 0) {
                throw new Error("좋아요에 실패하였습니다");
            }
            return this.getPostById(id);
        });
    },
    searchPostsByNickName(query) {
        return db.all(`
            select id, nickname, title, content, createdDate, likeCount, viewCount, img 
            from post
            where nickname like ?    
        `, `%${query}%`);
    },
    async searchPostsByTitle(query) {
        return db.all(`
            select id, nickname, title, content, createdDate, likeCount, viewCount, img 
            from post
            where title like ?    
        `, `%${query}%`);
    },
    async searchPostsByContent(query) {
        return db.all(`
            select id, nickname, title, content, createdDate, likeCount, viewCount, img 
            from post
            where content like ?    
        `, `%${query}%`);
    }
};