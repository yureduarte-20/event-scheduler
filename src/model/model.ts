export abstract class Model {
    public created_at? : Date | string;
    public updated_at? : Date | string;
    public id : number;
    constructor({ created_at, updated_at, id} : {  created_at? : Date | string,  updated_at? : Date | string, id: number }){
        this.created_at = created_at;
        this.updated_at = updated_at
        this.id = id
    }
}