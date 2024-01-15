import express from "express";
import postController
    from "../controllers/post-controller.js";

const router = express.Router();

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/', postController.createPost);
router.patch('/', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.post('/:id/view', postController.viewPost);
router.post('/:id/like', postController.likePost);
router.get('/search/title', postController.searchPostsByTitle); 
router.get('/search/nickname', postController.searchPostsByNickName);
router.get('/search/content', postController.searchPostsByContent);
export default router;