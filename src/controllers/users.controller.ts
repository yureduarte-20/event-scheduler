import { Request, Response } from 'express';
import connection from '../database/connection';
import { EntityFoundException, User } from '../Model/user.model';
import hash from '../utils/hash';
class UserController {
    public readonly USER_TABLE = 'users'
    async profile(request: Request, response: Response) {
        return response.json(
            await connection.select('id', 'name', 'email').from('users').first()
        )
    }

    async create(request: Request, response: Response) {
        try {
            const { email, password, name } = request.body
            const password_hashed = await hash.hashPassword(password);
            const id = await User.create({ email, password: password_hashed, name })
            return response.status(201).json({ id:id[0]})
        } catch (e) {

            if (e instanceof EntityFoundException)
                return response.status(422).json({ error: { message: e.message } });
            return response.status(500).json(e)
        }
    }
}

export const userController = new UserController();