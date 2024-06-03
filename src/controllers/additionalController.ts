import { Request, Response } from 'express';
import Like from '../model-db/likeBlog';
import Comment from '../model-db/commentBlog';
import UserBlog from '../model-db/userBlog';
import { AuthRequest } from '../middleware/auth';

export const likeBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { blogId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing in the token' });
    }

    const like = new Like({ userId, blogId });
    await like.save();

    res.status(201).json({ message: 'Blog liked successfully', like });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const unlikeBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { blogId } = req.params;
    const userId = req.user?.id;

    await Like.deleteOne({ userId, blogId });

    res.status(200).json({ message: 'Blog unliked successfully' });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const commentOnBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { blogId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing in the token' });
    }

    const comment = new Comment({ userId, blogId, content });
    await comment.save();

    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { blogId, commentId } = req.params;
    const userId = req.user?.id;

    await Comment.deleteOne({ _id: commentId, userId, blogId });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const getUserBlogs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    // console.log('userId >>>', userId);

    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing in the token' });
    }

    const userBlogs = await UserBlog.find({ userId }).populate('blogId');

    res.status(200).json({ userBlogs });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
