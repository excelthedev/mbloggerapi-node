import { Schema, model, Document } from 'mongoose';

interface IBlog extends Document {
  title: string;
  content: string;
  userId: Schema.Types.ObjectId; // Add userId field
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

const Blog = model<IBlog>('Blog', blogSchema);

export default Blog;
