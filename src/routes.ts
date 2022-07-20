import { Request, Response, Router } from "express";
import { homeController, userController, authController, placesController, eventController } from './controllers'
import { AutenticatedRequest, verifyToken } from "./middleware/auth.middleware";
import { Result, ValidationError, validationResult } from 'express-validator'
import placeValidator from "./validators/place.validator";
const router = Router();
router.get('/', homeController.index)

router.get('/profile', verifyToken, userController.profile);
router.patch('/profile', verifyToken, (req, res) => userController.edit(req as AutenticatedRequest, res));

router.post('/signup', (req, res) => userController.create(req, res));
router.post('/login', (req, res) => authController.login(req, res));


router.post('/places', verifyToken, ...placeValidator.post,
    (req: Request, res: Response) => {
        const validResult: Result<ValidationError> = validationResult(req)
        if (!validResult.isEmpty()) return res.status(400).json({ error: { message: 'Error de Validação' }, errors: validResult.array() })
        return placesController.create(req as AutenticatedRequest, res)
    });

router.get('/places', verifyToken, ...placeValidator.get, (req, res) => {
    const validResult: Result<ValidationError> = validationResult(req);
    if (!validResult.isEmpty()) return res.status(400).json({ error: { message: "Erro de Validação" }, errors: validResult.array() });
    return placesController.index(req as AutenticatedRequest, res);
});
router.get('/places/:id', ...placeValidator.getById ,(req, res) => {
    const validResult: Result<ValidationError> = validationResult(req);
    if (!validResult.isEmpty()) return res.json({ error: { message: "Erro de Validação" }, errors: validResult.array() })
    return placesController.find(req as AutenticatedRequest, res)
});

router.patch('/places/:id', verifyToken, (req, res) => placesController.edit(req as any, res))
router.post('/event', verifyToken, (req, res) => eventController.create(req as AutenticatedRequest, res))
router.get('/events', (req, res) => eventController.find(req, res))
export default router;