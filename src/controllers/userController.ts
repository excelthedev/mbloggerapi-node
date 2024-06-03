import express, { Request, Express, Response } from 'express';
import {
  createUser,
  getUserByEmail,
  getUserByEmailAndCode,
  getUserByIdToVerify,
  updateUserVerificationStatus,
} from '../model-db/users';
import { authentication, random } from '../helpers/helper';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET: string | any =
  process.env.JWT_SECRET || 'my-ghg-character-of-random-things-justto-use-jwt-learning-secret-you-would-not-get';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email or password is missing from the request' });
    }

    const existingEmail = await getUserByEmail(email);

    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exist' });
    }

    // const salt = random();
    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
      email,
      username,
      password,
      // password: authentication(password),
      // authentication: {
      //   salt,

      // },
    });

    return res.status(201).json({ message: 'Account created successfully', user });
  } catch (error: any) {
    console.error('Error from registerUser ', error);
    return res.status(400).json({ error: error?.message });
  }
};

export const verifyRegisteredUserEmail = async (req: Request, res: Response) => {
  try {
    const { email, verificationCode } = req.body;
    if (!email || !verificationCode) {
      return res.status(400).json({ message: 'Email or verification code is missing from the request' });
    }

    // Retrieve the user by email and verification code
    const user: any = await getUserByEmail(email);
    // const existingEmail = await getUserByEmail(email);
    // console.log('User>>>', user);

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or Verification code' });
    }

    // If user is already verified, return message
    if (user?.verified) {
      return res.status(400).json({ message: 'Email has already been verified' });
    }

    const updatedUser = await updateUserVerificationStatus(email);

    if (updatedUser) {
      return res.status(200).json({ message: 'Email verified successfully', user: updatedUser });
    }
  } catch (error: any) {
    console.error('Error from verifyRegisteredUserEmail', error);
    return res.status(400).json({ error: error?.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email or password is missing from the request' });
    }

    const user: any = await getUserByEmail(email);
    // console.log('User Details >>>', user);

    // return res.status(200).json({ message: 'User logged in' });

    // res.send(200).json({ messaqge: 'Recived boss' });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (user.verified !== true) {
      return res.status(400).json({ message: 'Email not verified' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Wrong password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    if (token) {
      // console.log('token on log in >>>>', token);
      return res.status(200).json({ message: 'Logged in Succesfully', token, user });
    }
  } catch (error: any) {
    console.error('Error from loginUser', error);
    return res.status(400).json({ error: error?.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is missing from the request' });
  }

  try {
    const user: any = await getUserByEmail(email);
    // console.log('email sent', email);

    if (email !== user?.email) {
      return res.status(400).json({ message: 'User does not exist' });
    } else {
      return res
        .status(200)
        .json({ message: 'Password Reset Activated', passwordResetLink: 'https://this-wont-take-you-anywhere.com' });
    }

    // If user is already verified, return message
    // if (!user?.verified) {
    //   return res.status(400).json({ message: 'Email has not been verified' });
    // }

    // return res.status(200).json({});
  } catch (error: any) {
    console.error('Error from forgotPassword', error);
    return res.status(400).json({ error: error?.message });
  }
};

export const testRoute = (req: Request, res: Response) => {
  return res.status(200).json({ message: 'API Working' });
};
