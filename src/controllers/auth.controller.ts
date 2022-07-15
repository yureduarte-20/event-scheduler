import { Request, Response } from "express";
import { generateToken } from "../middleware/auth.middleware";
import { User } from "../Model/user.model";
import hash from "../utils/hash";
class AuthController {
    async login(request: Request, response : Response){
        const { email, password } = request.body;
        const user = await User.findByEmail(email);
        if(!user) return response.status(404).json({ error:{ message: "Email não encontrado!" } });
        const result = await hash.comparePassword(password, user.password);
        if(!result ) return response.status(401).json({ error:{ message: "Senha incorreta" } });
        const token = generateToken({ id: user.id, email: user.email });
        return response.json({ token })
    }
}

export const authController = new AuthController();