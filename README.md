# 강아지 백엔드 

## GET /post
강아지 게시글 전부를 전부 긁어옵니다


## GET /post/{id}
아이디에 해당하는 강아지 게시글 정보를 긁어옵니다

## POST /post
새로운 게시글 정보를 등록합니다

### request parameter

#### Content-Type: application/json

|파라미터| 타입 | 필수| 설명|
|--|--|--|--|
|nickname| string | O | 강아지 닉네임 
| title | string | O | 강아지 타이틀
| content | string | O | 강아지 컨텐츠 

## PATCH /post
게시글 정보를 수정합니다

### request parameter 
#### Content-Type: application/json 

|파라미터|타입|필수|설명|
|--|--|--|--|
|id|int|O|삭제할 게시글의 아이디 값 | 
|nickname|string | X | 새로 수정할 닉네임 값|
|title|string|X| 새로 수정할 타이틀 값| 
|content | string |X| 새로 수정할 컨텐츠 값| 
|likeCount | int | X | 새로 수정할 좋아요 값| 
|viewCount | int | X | 새로 수정할 조회수 값| 


## DELETE /post/{id}
id 에 해당하는 게시글을 삭제합니다 


## POST /post/{id}/view
게시글을 조회합니다

## POST /post/{id}/like
게시글을 좋아요 합니다