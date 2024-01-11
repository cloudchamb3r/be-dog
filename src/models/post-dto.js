export class PostDto {
    id;
    nickname;
    title;
    content;
    createdDate;
    likeCount;
    viewCount;
    img;

    constructor({ id, nickname, title, content, createdDate, likeCount, viewCount, img }) {
        this.id = id;
        this.nickname = nickname;
        this.title = title;
        this.content = content;
        this.createdDate = createdDate;
        this.likeCount = likeCount;
        this.viewCount = viewCount;
        this.img = img;
    }

    toSqliteParam() {
        return {
            ':id': this.id,
            ':nickname': this.nickname,
            ':title': this.title,
            ':content': this.content,
            ':createdDate': this.createdDate,
            ':likeCount': this.likeCount,
            ':viewCount': this.viewCount,
            ':img': this.img,
        };
    }
}
