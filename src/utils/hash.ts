import {compare, genSalt, hash} from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();
class BcryptHasher  {
    public readonly rounds: number = Number(process.env.HASHER_ROUND);
    async comparePassword(providedPass: string, storedPass: string): Promise<boolean> {
      const passwordMatches = await compare(providedPass, storedPass);
      return passwordMatches; 
    }
    async hashPassword(password: string): Promise<string> {
      const salt = await genSalt(this.rounds);
      return await hash(password, salt);
    }
  }

export default new BcryptHasher();