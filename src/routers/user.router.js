import { Router } from 'express';
import {
  getUser,
  logout,
  changePassword,
  updateUserDetails,
  deleteAccount,
  updateAvatar,
  deleteAvatar,
} from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/token.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

const options = {
  name: 'avatar',
  maxCount: 1,
};

router.route('/myprofile').get(verifyToken, getUser);
router.route('/logout').get(verifyToken, logout);
router.route('/change-password').patch(verifyToken, changePassword);
router.route('/update-details').patch(verifyToken, updateUserDetails);
router.route('/delete-account').delete(verifyToken, deleteAccount);
router.route('/update-avatar').patch(upload.fields([options]), verifyToken, updateAvatar);
router.route('/delete-avatar').delete(verifyToken, deleteAvatar);

export default router;
