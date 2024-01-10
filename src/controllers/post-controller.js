import postRepository from '../repositories/post-repository.js';
import { PostDto } from '../models/post-dto.js';
export default {
    async getAllPosts(req, res) {
        try {
            const result = await postRepository.getAllPost();
            res.json({
                success: true,
                code: 0,
                message: '성공하였습니다',
                data: result
            });
        } catch (e) {
            res.json({
                success: false,
                code: -1,
                message: e.message,
                data: null,
            });
        }
    },
    async getPostById(req, res) {
        try {
            const result = await postRepository.getPostById(req.params.id);
            res.json({
                success: true,
                code: 0,
                message: '성공하였습니다',
                data: result,
            });
        } catch (e) {
            res.json({
                success: false,
                code: -1,
                message: e.message,
                data: null,
            });
        }
    },
    async createPost(req, res) {
        try {
            const now = (new Date()).toISOString();

            const dto = new PostDto({
                ...req.body,
                createdDate: now,
                likeCount: 0,
                viewCount: 0,
            });
            const id = await postRepository.insertPost(dto);

            res.json({
                success: true,
                code: 0,
                message: 'db 삽입 성공',
                data: {
                    ...dto,
                    id
                },
            });
        } catch (e) {
            res.json({
                success: false,
                code: -1,
                message: e.message,
                data: null,
            });
        }

    },
    async updatePost(req, res) {
        try {
            const dto = new PostDto(req.body);
            const data = await postRepository.updatePost(dto);
            res.json({
                success: true,
                code: 0,
                message: 'db 수정 성공',
                data,
            });
        } catch (e) {
            res.json({
                success: false,
                code: -1,
                message: e.message,
                data: null,
            });
        }
    },
    async deletePost(req, res) {
        try {
            const id = await postRepository.deletePostById(req.params.id);
            res.json({
                success: true,
                code: 0,
                message: '삭제 성공',
                data: {
                    id
                },
            });
        } catch (e) {
            res.json({
                success: false,
                code: -1,
                message: e.message,
                data: null,
            });
        }
    },
    async viewPost(req, res) {
        try {
            const data = await postRepository.viewPostById(req.params.id);
            res.json({
                sucess: true,
                code: 0,
                message: '조회 성공',
                data,
            });

        } catch (e) {
            res.json({
                success: false,
                code: -1,
                message: e.message,
                data: null,
            });
        }
    },
    async likePost(req, res) {
        try {
            const data = await postRepository.likePostById(req.params.id);
            res.json({
                success: true,
                code: 0,
                message: '좋아요 성공',
                data,
            });
        } catch (e) {
            res.json({
                success: false,
                code: -1,
                message: e.message,
                data: null,
            });
        }
    }
};
