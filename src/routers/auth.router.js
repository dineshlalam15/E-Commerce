import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { signUp, signIn, logout } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/token.middleware.js'

const router = Router();

const options = {
  name: 'avatar',
  maxCount: 1,
};

router.route('/signup').post(upload.fields([options]), signUp);
router.route('/signin').post(signIn);
router.route('/logout').get(verifyToken, logout)

export default router;
