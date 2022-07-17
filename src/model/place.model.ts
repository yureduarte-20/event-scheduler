import connection from "../database/connection";
import { Model } from "./model";
export const PLACE_TABLE = 'places'
export type IPlaceModel = IPlace & Model;
export interface IPlace {
    name: string;
    neighborhood?: string;
    street?: string;
    city: string;
    cep: string;
    state: string;
    country: string;
    address_number?: string;
}
export interface IUserPlaces {
    id: number;
    user_id: number;
    place_id: number;
}
export class Place extends Model implements IPlace {
    public name: string;
    public neighborhood?: string;
    public street?: string;
    public city: string;
    public cep: string;
    public state: string;
    public country: string;
    public address_number?: string;
    constructor(
        {
            id,
            cep,
            city,
            country,
            name,
            state,
            neighborhood,
            street,
            address_number,
            created_at, updated_at }:
            IPlaceModel) {
        super({ created_at, updated_at, id })
        this.cep = cep
        this.city = city
        this.country = country
        this.name = name
        this.state = state;
        this.neighborhood = neighborhood
        this.street = street
        this.address_number = address_number
    }

    static async create({ cep, city, country, name, state, neighborhood, street, address_number }: IPlace) {
        return await connection.insert<Place>({ cep, city, country, name, state, neighborhood, street, address_number }).into("places")
    }
    static async findById(place_id: number) {
        const place_data = await connection.select<Place>('*').from(PLACE_TABLE).where("id", place_id).first();
        if (!place_data) return;
        if (place_data.created_at)
            place_data.created_at = new Date(place_data.created_at);
        if (place_data.updated_at)
            place_data.updated_at = new Date(place_data.updated_at);
        return new Place(place_data);
    }
    async save() {
        return await connection(PLACE_TABLE).where<Place>("id", this.id).update<Place>({ ...this })
    }
}
