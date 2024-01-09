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


