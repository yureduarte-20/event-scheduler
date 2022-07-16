import { Router } from "express";
import { homeController, userController , authController, placesController } from './controllers'
import { verifyToken } from "./middleware/auth.middleware";
const router = Router();
router.get('/', homeController.index)
router.get('/profile',verifyToken, userController.profile);
router.post('/signup', userController.create);
router.post('/login', authController.login)
router.post('/places', verifyToken, (req, res) => placesController.create(req as any, res))
export default router;