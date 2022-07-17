import connection from "../database/connection";
import { EntityFoundException, NotFoundException } from "../exceptions";

export const USER_TABLE = 'users';
export class User {

    email: string;
    password: string;
    name: string;
    id: number;
    constructor({ name, password, email, id }: { name: string, password: string, email: string, id: number }) {
        this.name = name;
        this.password = password;
        this.email = email
        this.id = id;
    }
    static async create({ name, password, email }: { name: string, password: string, email: string }) {
        const user_found = await connection.select('*').from(USER_TABLE).where('email', email).first();
        if (user_found) throw new EntityFoundException(`Email ${email} já em uso`);
        let new_data = await connection.insert({ email, password, name }).into(USER_TABLE);
        return new_data;
    }
    static async findById(user_id: number) {
        const user_data = await connection.select<User>('*').from(USER_TABLE).where("id", user_id).first();
        if (!user_data) return ;
        return new User({ id: user_data.id, email: user_data.email, name: user_data.name, password: user_data.password });
    }
    static async findByEmail(email: string) {
        return await connection.select<User>('*').from(USER_TABLE).where("email", email).first();
    }
    async save() {
        return await connection(USER_TABLE).where<User>("id", this.id).update<User>({ ...this })
    }
}