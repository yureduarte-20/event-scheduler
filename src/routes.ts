import { Request, Response, Router } from "express";
import { homeController, userController, authController, placesController, eventController } from './controllers'
import { AutenticatedRequest, verifyToken } from "./middleware/auth.middleware";
import { Result, ValidationError, validationResult } from 'express-validator'
import placeValidator from "./validators/place.validator";
import authValidator from "./validators/auth.validator";
import eventsValidator from "./validators/events.validator";
const router = Router();

router.get('/api-swagger', homeController.index)
router.get('/profile', verifyToken, (req, res) => userController.profile(req as AutenticatedRequest, res));
router.patch('/profile', verifyToken, (req, res) => userController.edit(req as AutenticatedRequest, res));
router.post('/signup', ...authValidator.signup, (req, res) => {
    const validResult: Result<ValidationError> = validationResult(req);
    if (!validResult.isEmpty()) return res.status(400).json({ error: { message: "Erro de Validação" }, errors: validResult.array() })
    return userController.create(req as any, res)
});
router.post('/login', ...authValidator.login, (req: Request, res: Response) => {
    const validResult: Result<ValidationError> = validationResult(req);
    if (!validResult.isEmpty()) return res.status(400).json({ error: { message: "Erro de Validação" }, errors: validResult.array() });
    return authController.login(req, res)
});


router.post('/places', verifyToken, ...placeValidator.post,
    (req: Request, res: Response) => {
        const validResult: Result<ValidationError> = validationResult(req)
        if (!validResult.isEmpty()) return res.status(400).json({ error: { message: 'Erro de Validação' }, errors: validResult.array() })
        return placesController.create(req as AutenticatedRequest, res)
    });

router.get('/places', verifyToken, ...placeValidator.get, (req, res) => {
    const validResult: Result<ValidationError> = validationResult(req);
    if (!validResult.isEmpty()) return res.status(400).json({ error: { message: "Erro de Validação" }, errors: validResult.array() });
    return placesController.index(req as AutenticatedRequest, res);
});
router.get('/places/:id', verifyToken,...placeValidator.getById, (req, res) => {
    const validResult: Result<ValidationError> = validationResult(req);
    if (!validResult.isEmpty()) return res.status(400).json({ error: { message: "Erro de Validação" }, errors: validResult.array() })
    return placesController.find(req as AutenticatedRequest, res)
});

router.patch('/places/:id', verifyToken, ...placeValidator.patch, (req, res) => {
    const validResult: Result<ValidationError> = validationResult(req);
    if (!validResult.isEmpty()) return res.status(400).json({ error: { message: "Erro de Validação" }, errors: validResult.array() })
    return placesController.edit(req as any, res)
})


router.post('/event', verifyToken, ...eventsValidator.post, (req, res) => {
    const valid: Result<ValidationError> = validationResult(req);
    if (!valid.isEmpty()) return res.status(400).json({ error: { message: 'Erro de Validação' }, errors: valid.array() })
    return eventController.create(req as AutenticatedRequest, res)
})
router.patch('/event/:id', verifyToken, ...eventsValidator.patch,
    (req, res) => {
        const validResult: Result<ValidationError> = validationResult(req)
        if (!validResult.isEmpty()) return res.status(400).json({ error: { message: "Erro de Validação" }, errors: validResult.array() });
        return eventController.edit(req as AutenticatedRequest, res);
    });
router.get('/events', ...eventsValidator.get, (req, res) => {
    const valid: Result<ValidationError> = validationResult(req);
    if (!valid.isEmpty()) return res.status(400).json({ error: { message: "Erro de Validação" }, errors: valid.array() })
    return eventController.find(req as Request, res)
});
router.get('/event/:id', ...eventsValidator.getById, (req, res) =>{
    const validResult : Result<ValidationError> = validationResult(req);
    if(!validResult.isEmpty()) return res.status(400).json({ error:{ message:'Erro de Validação' }, errors: validResult.array() })
    return eventController.findById(req as Request, res)
})
export default router;