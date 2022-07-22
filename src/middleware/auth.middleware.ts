import { decode, sign, verify } from 'jsonwebtoken';
import env from 'dotenv';
import { NextFunction, Request, Response } from 'express';
env.config()
export const generateToken = ({ id, email }: { id: number, email: string }) => sign({ id, email }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
export interface AutenticatedRequest extends Request {
    userId: number;
    userEmail: string;
}
export const verifyToken = (req: any, res: Response, next: NextFunction) => {

    var token: string | undefined = req.headers["authorization"] ?? req.headers["Authorization"];
    console.log(token)
    if (!token)
        return res.status(401).json({ auth: false, message: "No token provided." });
    if (!token.startsWith('Bearer ')) return res.status(400).json({ auth: false, message: "token must be on Bearer format" });
    verify(token.split(' ')[1] as string, process.env.JWT_SECRET as string, function (err, decoded: any) {
        if (err)
            return res
                .status(401)
                .json({ auth: false, message: "Failed to authenticate token." });

        // se tudo estiver ok, salva no request para uso posterior
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        next();
    });
}