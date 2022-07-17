import { Router } from "express";
import { homeController, userController , authController, placesController } from './controllers'
import { AutenticatedRequest, verifyToken } from "./middleware/auth.middleware";
const router = Router();
router.get('/', homeController.index)

router.get('/profile',verifyToken, userController.profile);
router.patch('/profile',verifyToken, (req, res) => userController.edit(req as AutenticatedRequest, res));

router.post('/signup', userController.create);
router.post('/login', authController.login)

router.post('/places', verifyToken, (req, res) => placesController.create(req as AutenticatedRequest, res));
router.get('/places', verifyToken, placesController.index)
router.patch('/places/:id', verifyToken, (req, res) => placesController.edit(req as any, res))
export default router;