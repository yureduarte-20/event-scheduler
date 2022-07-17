import connection from "../database/connection";
export const PLACE_TABLE = 'places'
export interface IPlace {
    id: number;
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
    user_id: number;
    place_id: number;
}
export class Place {
    id: number;
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
            id,
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
        this.id = id
        this.name = name
        this.state = state;
        this.created_at = created_at;
        this.neighborhood = neighborhood
        this.street = street
        this.updated_at = updated_at
    }

    static async create({ cep, city, country, name, state, neighborhood, street }: IPlace) {
        return await connection.insert<Place>({ cep, city, country, name, state, neighborhood, street }).into("places")
    }
    static async findById(place_id: number) {
        const place_data = await connection.select<Place>('*').from(PLACE_TABLE).where("id", place_id).first();
        if (!place_data) return;
        return new Place({ ...place_data });
    }
    async save() {
        return await connection(PLACE_TABLE).where<Place>("id", this.id).update<Place>({ ...this })
    }
}
