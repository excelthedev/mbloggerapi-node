import express from 'express';
import { createBlog, editBlog, deleteBlog, getBlogs, testBlogRoute } from '../controllers/blogController';
import { likeBlog, unlikeBlog, commentOnBlog, deleteComment, getUserBlogs } from '../controllers/additionalController';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/', auth, createBlog);
router.put('/:blogId', auth, editBlog);
router.delete('/:blogId', auth, deleteBlog);
router.get('/allBlogs', auth, getBlogs);
router.get('/test', auth, testBlogRoute);

// additonal routes

router.post('/:blogId/like', auth, likeBlog);
router.delete('/:blogId/unlike', auth, unlikeBlog);
router.post('/:blogId/comments', auth, commentOnBlog);
router.delete('/:blogId/comments/:commentId', auth, deleteComment);
router.get('/user/blogs', auth, getUserBlogs);

export default router;
