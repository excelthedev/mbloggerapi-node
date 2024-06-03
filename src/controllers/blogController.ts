import { Request, Response } from 'express';
import Blog from '../model-db/blog';
import { AuthRequest } from '../middleware/auth';

export const createBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing in the token' });
    }

    const blog = new Blog({ title, content, userId: userId });
    await blog.save();
    res.status(201).json({ message: 'Blog post created Sucessfully', blog, userId: userId });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const editBlog = async (req: AuthRequest, res: Response) => {
  const { blogId } = req.params;
  const updates = req.body;
  const userId = req.user.id;

  try {
    const blog = await Blog.findByIdAndUpdate(blogId, updates, { new: true, runValidators: true });
    if (!blog) {
      return res.status(404).json({ message: 'No post to update' });
    }
    res.json({ message: 'Edit Success', blog, userId: userId });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteBlog = async (req: AuthRequest, res: Response) => {
  const { blogId } = req.params;
  const userId = req.user.id;

  try {
    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) {
      return res.status(404).send();
    }
    res.json({ mesage: 'Deleted Blog Post', blog, userId: userId });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getBlogs = async (_req: AuthRequest, res: Response) => {
  try {
    const blogs = await Blog.find({});
    res.json(blogs);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const testBlogRoute = (req: AuthRequest, res: Response) => {
  return res.status(200).json({ message: 'API Working for Blog Route', userId: req.user.id });
};
