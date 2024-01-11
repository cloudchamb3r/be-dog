import postRepository from '../repositories/post-repository.js';
import { PostDto } from '../models/post-dto.js';
import jsonResponse from '../util/json-response.js';
export default {
    async getAllPosts(req, res) {
        try {
            const data = await postRepository.getAllPost();
            res.json(jsonResponse.success(data));
        } catch (e) {
            res.json(jsonResponse.fail(e));
        }
    },
    async getPostById(req, res) {
        try {
            const data = await postRepository.getPostById(req.params.id);
            res.json(jsonResponse.success(data));
        } catch (e) {
            res.json(jsonResponse.fail(e));
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
            const data = await postRepository.insertPost(dto);
            res.json(jsonResponse.success(data));
        } catch (e) {
            res.json(jsonResponse.fail(e));
        }

    },
    async updatePost(req, res) {
        try {
            const dto = new PostDto(req.body);
            const data = await postRepository.updatePost(dto);
            res.json(jsonResponse.success(data));
        } catch (e) {
            res.json(jsonResponse.fail(e));
        }
    },
    async deletePost(req, res) {
        try {
            const id = await postRepository.deletePostById(req.params.id);
            res.json(jsonResponse.success({ id }));
        } catch (e) {
            res.json(jsonResponse.fail(e));
        }
    },
    async viewPost(req, res) {
        try {
            const data = await postRepository.viewPostById(req.params.id);
            res.json(jsonResponse.success(data));
        } catch (e) {
            res.json(jsonResponse.fail(e));
        }
    },
    async likePost(req, res) {
        try {
            const data = await postRepository.likePostById(req.params.id);
            res.json(jsonResponse.success(data));
        } catch (e) {
            res.json(jsonResponse.fail(e));
        }
    },
};
