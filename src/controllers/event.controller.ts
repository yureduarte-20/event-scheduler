import { Request, Response } from "express";
import connection from "../database/connection";
import { AutenticatedRequest } from "../middleware/auth.middleware";
import { Event, IEvent, IEventModel } from "../model/event.model";
import { Place } from "../model/place.model";
import { iso_to_datetime } from "../utils/date";

class EventController {
    private readonly page_step = 20
    async create(req: AutenticatedRequest, response: Response) {
        const { ends_at, name, place_id, starts_at, room }: IEvent = req.body;
        const { userId } = req;
        const place = await Place.findById(place_id);
        if (!place) return response.status(404).json({ error: { message: `Lugar com id ${place_id} não encontrado. Crie um para continuar` } });
        const id: any = await Event.create({ ends_at, name, place_id, starts_at, room, user_id: userId })
        return response.json({ id: id[0] })
    }

    async find(request: Request, response: Response) {
        const { startsAt, withOlds } = request.query;
        let page = parseInt(request.query.page as any) || 1;
        if (page < 1) page = 1;

        if (startsAt) {
            try {

                let d = new Date(startsAt as string)
                console.log(d)
                return response.json({
                    nextPage: page + 1,
                    events: (await connection
                        .raw(`
                    SELECT 
                        E.name AS event_name,
                        E.starts_at AS starts_at,
                        E.ends_at AS ends_at,
                        E.room AS room,
                        E.place_id AS place_id,
                        P.name AS place_name,
                        ( P.street || ', ' || CASE WHEN P.address_number IS NULL THEN '' ELSE  P.address_number || ', ' END
                        || P.neighborhood || ', ' || p.city || ', ' || p.state || ', ' || p.country ) as address
                    FROM events AS E
                    INNER JOIN places AS P ON P.id = E.place_id
                    WHERE E.starts_at >= ?
                    LIMIT ? OFFSET ?
                    ;`, [iso_to_datetime(new Date(startsAt as string).toISOString()), this.page_step, (page - 1) * this.page_step])).map((item: any) => {
                            item.starts_at = new Date(item.starts_at);
                            item.ends_at = new Date(item.ends_at);
                            return item
                        })
                })
            } catch (e) {
                return response.status(422).json({ e: { message: "Data inválida" } })
            }

        }
        if (withOlds)
            return response.json({
                nextPage: page + 1,
                events: (await connection
                    .raw(
                        `SELECT 
                            E.name AS event_name,
                            E.starts_at AS starts_at,
                            E.ends_at AS ends_at,
                            E.room AS room,
                            E.place_id AS place_id,
                            P.name AS place_name,
                            ( P.street || ', ' || CASE WHEN P.address_number IS NULL THEN '' ELSE  P.address_number || ', ' END
                                || P.neighborhood || ', ' || p.city || ', ' || p.state || ', ' || p.country ) as address
                        FROM events AS E
                        INNER JOIN places AS P ON P.id = E.place_id
                        LIMIT ? OFFSET ?
                ;`, [this.page_step, (page - 1) * this.page_step])).map((item: any) => {
                            item.starts_at = new Date(item.starts_at);
                            item.ends_at = new Date(item.ends_at);
                            return item
                        })
            })

        return response.json({
            nextPage: page + 1,
            events: (await connection
                .raw(
                    `SELECT 
                    E.name AS event_name,
                    E.starts_at AS starts_at,
                    E.ends_at AS ends_at,
                    E.room AS room,
                    E.place_id AS place_id,
                    P.name AS place_name,
                    ( P.street || ', ' || CASE WHEN P.address_number IS NULL THEN '' ELSE  P.address_number || ', ' END
                     || P.neighborhood || ', ' || p.city || ', ' || p.state || ', ' || p.country ) as address
                FROM events AS E
                INNER JOIN places AS P ON P.id = E.place_id
                WHERE E.ends_at >= ?
                LIMIT ? OFFSET ?
                ;`, [iso_to_datetime(new Date().toISOString()), this.page_step, (page - 1) * this.page_step])).map((item: any) => {
                        item.starts_at = new Date(item.starts_at);
                        item.ends_at = new Date(item.ends_at);
                        return item
                    })
        })
    }

    async findById(request: Request, response: Response) {
        const event = await Event.findById(parseInt(request.params.id));
        if (!event) return response.status(404).json({ error: { message: "Não encontrado" } })
        return response.json(event);
    }
    async edit(request: AutenticatedRequest, response: Response) {
        const { userId } = request;
        const { id: eventId } = request.params;
        const { ends_at, name, place_id, room, starts_at }: Partial<IEvent> = request.body;
        const event = await Event.findById(parseInt(eventId));
        if (!event) return response.status(404).json({ error: { message: "evento não encontrado." } });
        if (event.user_id !== userId) return response.status(403).json({ error: { message: "Você só pode editar eventos criados por você." } });
        event.name = name ?? event.name;
        event.ends_at = ends_at ?? event.ends_at;
        event.starts_at = starts_at ?? event.starts_at;
        event.room = room ?? event.room;
        event.place_id = place_id ?? event.place_id;
        try {
            await event.save();
            return response.status(204).send();
        } catch (e) {
            return response.status(422).json({ error: { message: 'Erro ao atualizar' }, errors: e });
        }
    }
}


export const eventController = new EventController();