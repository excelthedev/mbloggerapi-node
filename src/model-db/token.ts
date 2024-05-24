import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { required } from 'joi';

const TokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, required: true, ref: 'user' },
    token: { type: String, required: true },
  },
  { timestamps: true },
);

export const TokenModel = mongoose.model('User', TokenSchema);
