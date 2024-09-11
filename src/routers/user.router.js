import { Router } from "express";
import { getUser, logout, changePassword, updateUserDetails, deleteAccount } from "../controllers/user.controller.js"
import { verifyToken } from "../middlewares/token.middleware.js";

const router = Router()

router.route('/myprofile').get(verifyToken, getUser)
router.route('logout').post(verifyToken, logout)
router.route('change-password').patch(verifyToken, changePassword)
router.route('update-details').patch(verifyToken, updateUserDetails)
router.route('delete-account').delete(verifyToken, deleteAccount)

export default router
