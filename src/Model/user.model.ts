import connection from "../database/connection";
export class EntityFoundException extends Error {
    constructor( message? :string){
        super("EntityFoundException");
        this.message = message ?? `Entidade encontrada`;
    }
}

export const USER_TABLE = 'users';
export class User {
    
    email: string;
    password : string;
    name: string;
    id: number;
    constructor({ name, password, email, id  } : { name : string, password : string, email : string, id: number  }){
        this.name = name;
        this.password = password;
        this.email = email
        this.id = id;
    }
    static async create ({ name, password, email } : { name : string, password : string, email : string }){
        const user_found = await connection.select('*').from(USER_TABLE).where('email', email).first();
        if (user_found) throw new EntityFoundException(`Email ${email} já em uso`);
        console.log(user_found)
        let new_data = await connection.insert({ email, password, name }).into(USER_TABLE);
        return new_data;
    }
    static async findById(id : number){
        return await connection.select<User>('*').from(USER_TABLE).where("id", id).first();
    }
    static async findByEmail(email : string) {
        return await connection.select<User>('*').from(USER_TABLE).where<User>("email", email).first();
    }
}