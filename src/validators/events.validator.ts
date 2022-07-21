import { body, param, query } from 'express-validator';

export default {
    get:[ query('startsAt').isDate().optional() ],
    post:[
        body('name').isString().notEmpty({ ignore_whitespace:true }),
        body('starts_at').isDate().notEmpty(),
        body('ends_at').isDate().notEmpty(),
        body('room').optional(),
        body('place_id').isInt()
    ],
    patch:[
        body('name').isString().notEmpty({ ignore_whitespace:true }).optional(),
        body('starts_at').isDate().notEmpty().optional(),
        body('ends_at').isDate().notEmpty().optional(),
        body('room').optional().optional(),
        body('place_id').isInt().optional(),
    ]
}