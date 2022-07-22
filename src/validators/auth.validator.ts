import { body } from 'express-validator';

export default {
    signup: [
        body('name').isString().notEmpty(),
        body('email').isString().notEmpty().isEmail(),
        body('password').isString().isLength( { min:8 } )
    ],
    login: [
        body('email', "Email inválido").isEmail(),
        body('password').isString().isLength({ min:8 })
    ]
}