import { body, param, query } from 'express-validator';

export default {
    post: [
        body('name', "Formato name inválido").notEmpty().isString(),
        body('neighborhood', "Formato neighborhood inválido").notEmpty().isString(),
        body('street').notEmpty().isString(),
        body('city').notEmpty().isString(),
        body('state').notEmpty().isString(),
        body('country').isString().notEmpty(),
        body('address_number').isString().isNumeric().optional()
    ],
    get: [
        query("page", 'a QueryParam "page" necessita ser numérica' ).isNumeric({ no_symbols:true }).optional()
    ],
    patch: [
        body('name', "Formato name inválido").notEmpty().isString().optional(),
        body('neighborhood', "Formato neighborhood inválido").notEmpty().isString().optional(),
        body('street',  "Formato street inválido").notEmpty().isString().optional(),
        body('city',  "Formato city inválido").notEmpty().isString().optional(),
        body('state',  "Formato state inválido").notEmpty().isString().optional(),
        body('country',  "Formato country inválido").isString().notEmpty().optional(),
        body('address_number').isString().isNumeric().optional()
    ],
    getById: [
        param("id", "id precisa ser numérico").isNumeric()
    ]
}