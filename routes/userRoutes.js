import express from 'express';
import { getMe, login, logout, register } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/getme').get(isAuthenticated, getMe);


export default router;
// sachin 