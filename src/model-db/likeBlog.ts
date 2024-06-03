import { Schema, model, Document } from 'mongoose';

interface ILike extends Document {
  userId: Schema.Types.ObjectId;
  blogId: Schema.Types.ObjectId;
}

const likeSchema = new Schema<ILike>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    blogId: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
  },
  { timestamps: true },
);

const Like = model<ILike>('Like', likeSchema);

export default Like;
