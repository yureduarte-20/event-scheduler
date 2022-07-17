export class EntityFoundException extends Error {
    constructor( message? :string){
        super("EntityFoundException");
        this.message = message ?? `Entidade encontrada`;
    }
}
export class NotFoundException extends Error {
    constructor(message? : string){
        super(message ?? "Não encontrado");
    }
}
