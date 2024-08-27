import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { signUp } from '../controllers/auth.controller.js';

const router = Router();

const options = {
  name: 'avatar',
  maxCount: 1,
};

router.route('/signup').post(upload.fields([options]), signUp);

export default router;
