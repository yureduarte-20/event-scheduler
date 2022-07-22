import { Request, Response } from 'express';
import connection from '../database/connection';
import { EntityFoundException } from '../exceptions';
import { AutenticatedRequest } from '../middleware/auth.middleware';
import { User } from '../model/user.model';
import hash from '../utils/hash';
class UserController {
    public readonly USER_TABLE = 'users'
    async profile(request: AutenticatedRequest, response: Response) {
        return response.json(
            await connection
            .select('id', 'name', 'email')
            .from('users').where('id', request.userId).first()
        )
    }

    async create(request: Request, response: Response) {
        try {
            const { email, password, name } = request.body
            const password_hashed = await hash.hashPassword(password);
            const id = await User.create({ email, password: password_hashed, name })
            return response.status(201).json({ id: id[0] })
        } catch (e) {

            if (e instanceof EntityFoundException)
                return response.status(422).json({ error: { message: e.message } });
            return response.status(500).json(e)
        }
    }

    async edit(request: AutenticatedRequest, response: Response) {
        const { name, email, password } = request.body;
        const { userId } = request;
        const user: (User | undefined) = await User.findById(userId);
        if (!user) return response.status(404).json({ error: { message: "Não encontrado" } });
        user.email = email ?? user.email;
        user.name = name ?? user.name;
        if (password) user.password = await hash.hashPassword(password);
        try {
            await user.save();
            return response.status(204).send();
        } catch (e) {
            console.log(e);
            return response.status(400).json({ e });
        }
    }
}

export const userController = new UserController();