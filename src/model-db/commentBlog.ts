import { Schema, model, Document } from 'mongoose';

interface IComment extends Document {
  userId: Schema.Types.ObjectId;
  blogId: Schema.Types.ObjectId;
  content: string;
}

const commentSchema = new Schema<IComment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    blogId: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

const Comment = model<IComment>('Comment', commentSchema);

export default Comment;
