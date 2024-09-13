import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { signUp, signIn } from '../controllers/auth.controller.js';

const router = Router();

const options = {
  name: 'avatar',
  maxCount: 1,
};

router.route('/signup').post(upload.fields([options]), signUp);
router.route('/signin').post(signIn);

export default router;