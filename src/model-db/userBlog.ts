import { Schema, model, Document } from 'mongoose';

interface IUserBlog extends Document {
  userId: Schema.Types.ObjectId;
  blogId: Schema.Types.ObjectId;
}

const userBlogSchema = new Schema<IUserBlog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    blogId: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
  },
  { timestamps: true },
);

const UserBlog = model<IUserBlog>('UserBlog', userBlogSchema);

export default UserBlog;
