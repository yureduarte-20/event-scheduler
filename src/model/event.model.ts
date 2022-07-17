import connection from "../database/connection";
import { iso_to_datetime } from "../utils/date";
import { Model } from "./model";

export interface IEvent {
    name: string;
    place_id: number;
    user_id: number;
    room?: string;
    starts_at: Date | string;
    ends_at: Date | string;
}
export type IEventModel = IEvent & Model;
export class Event extends Model {
    public name: string;
    public place_id: number;
    public user_id: number;
    public room?: string;
    public starts_at: Date | string;
    public ends_at: Date | string;
    constructor({ name, place_id, user_id, room, created_at, updated_at, starts_at, ends_at, id }: IEventModel) {
        super({ created_at, updated_at, id });
        this.name = name;
        this.place_id = place_id; Event
        this.user_id = user_id;
        this.room = room;
        this.starts_at = starts_at;
        this.ends_at = ends_at
    }
    static async create({ ends_at, name, place_id, starts_at, user_id, room }: IEvent) {
        starts_at = iso_to_datetime(new Date(starts_at).toISOString());
        ends_at = iso_to_datetime(new Date(ends_at).toISOString())
        return await connection.insert<IEvent>({ ends_at, name, place_id, starts_at, user_id, room }).into("events")
    }
    static async findById(id: number) {
        const event_data = await connection.select<IEventModel>('*').from('events').where("id", id).first();

        if (!event_data) return;
        if (event_data.created_at)
            event_data.created_at = new Date(event_data.created_at);
        if (event_data.updated_at)
            event_data.updated_at = new Date(event_data.updated_at);
        if (event_data.starts_at)
            event_data.starts_at = new Date(event_data.starts_at);
        if (event_data.ends_at)
            event_data.ends_at = new Date(event_data.ends_at);

        return new Event(event_data);
    }

    async save() {
        return await connection('events').where<IEventModel>("id", this.id).update<IEventModel>({ ...this })
    }

}
