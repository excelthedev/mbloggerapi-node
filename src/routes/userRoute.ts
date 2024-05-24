import express, { Router } from 'express';
import {
  forgotPassword,
  loginUser,
  registerUser,
  testRoute,
  verifyRegisteredUserEmail,
} from '../controllers/userController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-email', verifyRegisteredUserEmail); //id here in this case is the email
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.get('/check', testRoute);

export default router;
