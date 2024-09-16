import { Router } from 'express';
import { verifyMerchantToken } from '../middlewares/token.middleware.js';
import {
  createMerchantAccount,
  merchantLogin,
  merchantLogout,
  addMerchantAddress,
  getMerchant,
  disableMerchantAccount,
  deleteMerchantAccount,
} from '../controllers/merchant.controller.js';

const router = Router();

router.route('/create-account').post(createMerchantAccount);
router.route('/login').post(merchantLogin);
router.route('/add-address').post(verifyMerchantToken, addMerchantAddress);
router.route('/profile/:id').get(verifyMerchantToken, getMerchant);
router.route('/logout').get(verifyMerchantToken, merchantLogout);
router
  .route('/disable-account/:id')
  .get(verifyMerchantToken, disableMerchantAccount);
router
  .route('/delete-account/:id')
  .delete(verifyMerchantToken, deleteMerchantAccount);

export { router };
