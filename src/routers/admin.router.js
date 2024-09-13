import { Router } from 'express';
import { checkAdmin } from '../middlewares/admin.middleware.js';
import {
  deleteMerchant,
  deleteUser,
  getAllMerchants,
  getAllUsers,
} from '../controllers/admin.controller.js';
import { verifyToken } from '../middlewares/token.middleware.js';

const router = Router();

router.route('/all-users').get(verifyToken, checkAdmin, getAllUsers);
router.route('/delete-user').delete(verifyToken, checkAdmin, deleteUser);
router.route('/all-merchants').get(verifyToken, checkAdmin, getAllMerchants);
router.route('/delete-merchant').delete(verifyToken, checkAdmin, deleteMerchant);

export default router;
