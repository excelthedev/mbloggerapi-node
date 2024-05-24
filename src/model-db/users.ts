import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter a valid Email',
      ],
    },
    password: { type: String, required: true, minLength: [6, 'password must be up to 6 characters'] },
    // authentication: {
    //   salt: { type: String },
    //   sessionToken: { type: String },
    // },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: Number,
      default: 123456,
    },
  },
  { timestamps: true },
);

UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;
  next();
});

export const UserModel = mongoose.model('User', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = async (email: string) => UserModel.findOne({ email });
export const getUserByEmailAndCode = async (email: string, verificationCode: number) => {
  return UserModel.findOne({ email, verificationCode });
};
export const updateUserVerificationStatus = async (email: string) =>
  UserModel.findOneAndUpdate(
    { email },
    { verified: true, verificationCode: null },
    { new: true, projection: { verificationCode: 0 } },
  );

export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ 'authentication.sessionToken': sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);
export const getUserByIdToVerify = (id: string) => UserModel.findById(id).select('verified');
export const createUser = async (values: Record<string, any>) => {
  const user = new UserModel(values);
  return user.save();
};
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate({ _id: id });
