import connection from "../database/connection";

export interface IPlace {
    name: string;
    neighborhood?: string;
    street?: string;
    city: string;
    cep: string;
    state: string;
    country: string;
    created_at?: string;
    updated_at?: string;
}
export interface IUserPlaces {
    id: number;
    user_id:number;
    place_id:number;
}
export class Place {
    name: string;
    neighborhood?: string;
    street?: string;
    city: string;
    cep: string;
    state: string;
    country: string;
    created_at?: string;
    updated_at?: string;

    constructor(
        {
            cep,
            city,
            country,
            name,
            state,
            created_at,
            neighborhood,
            street,
            updated_at }:
            IPlace) {
        this.cep = cep
        this.city = city
        this.country = country
        this.name = name
        this.state = state;
        this.created_at = created_at;
        this.neighborhood = neighborhood
        this.street = street
        this.updated_at = updated_at
    }

    static async create({ cep, city, country,name, state,  neighborhood, street } : IPlace) {
        return await connection.insert<Place>({ cep, city, country,name, state, neighborhood, street  }).into("places")
    }
}