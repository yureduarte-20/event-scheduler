import connection from "../database/connection";
import { EntityFoundException, NotFoundException } from "../exceptions";
import { Model } from "./model";
export interface IUser {
    email: string;
    password: string;
    name: string;
}
export type IUserModel = IUser & Model
export const USER_TABLE = 'users';
export class User extends Model {

    email: string;
    password: string;
    name: string;
    constructor({ name, password, email, id, created_at, updated_at }: IUserModel) {
        super({ created_at: created_at, updated_at: updated_at, id })
        this.name = name;
        this.password = password;
        this.email = email
    }
    static async create({ name, password, email }: { name: string, password: string, email: string }) {
        const user_found = await connection.select('*').from(USER_TABLE).where('email', email).first();
        if (user_found) throw new EntityFoundException(`Email ${email} já em uso`);
        let new_data = await connection.insert({ email, password, name }).into(USER_TABLE);
        return new_data;
    }
    static async findById(user_id: number) {
        const user_data = await connection.select<IUserModel>('*').from(USER_TABLE).where("id", user_id).first();
        if (!user_data) return;
        return new User({ ...user_data });
    }
    static async findByEmail(email: string) {
        return await connection.select<User>('*').from(USER_TABLE).where("email", email).first();
    }
    async save() {
        return await connection(USER_TABLE).where<User>("id", this.id).update<User>({ ...this })
    }
}