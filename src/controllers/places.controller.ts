import { Request, Response } from "express";
import connection from "../database/connection";
import { AutenticatedRequest } from "../middleware/auth.middleware";
import { IPlace, IPlaceModel, IUserPlaces, Place, PLACE_TABLE } from "../model/place.model";

class PlacesController {
    static count_page = 20
    async index(request: Request, response: Response) {
        let params = request.query;
        let page = parseInt(params.page as any) || 1;
        if (page < 1) page = 1;
        const places = await connection(PLACE_TABLE).select<IPlaceModel[]>('*').limit(PlacesController.count_page).offset((page - 1) * PlacesController.count_page);
        places.forEach(element => {
            if (element.created_at)
                element.created_at = new Date(element.created_at);
            if (element.updated_at)
                element.updated_at = new Date(element.updated_at)
        });
        return response.json({
            places: places,
            nextPage: page + 1,
        })
    }

    async create(request: AutenticatedRequest, response: Response) {
        const { cep, city, country, name, state, address_number,  neighborhood, street  }: IPlace = request.body
        const { userId } = request;
        try {
            const id: any = await Place.create({ cep, city, country, name, state, address_number,  neighborhood, street });
            const id_user_place: any = await connection.insert<IUserPlaces>({ user_id: userId, place_id: id[0] }).into("user_places")
            return response.status(201).json({ id: id[0] })
        } catch (e) {
            console.log(e)
            return response.status(422).json(e);
        }
    }
    async edit(request: AutenticatedRequest, response: Response) {
        const { userId } = request;
        const { id } = request.params;
        const { cep, city, country, name, state, neighborhood, street }: Partial<IPlaceModel> = request.body;
        const place_saved = await Place.findById(parseInt(id));
        if (!place_saved) return response.status(404).json({ error: { message: "Lugar não encontrado" } })
        const { user_id } = await connection.select("user_id").from("user_places").where("id", place_saved.id).first();
        if (!user_id) return response.status(404).json();
        console.log(user_id, userId)
        if (userId !== user_id) return response.status(403).json({ error: { message: "Você só pode alterar lugares que você criou, mas você pode criar um." } });
        place_saved.cep = cep ?? place_saved.cep
        place_saved.city = city ?? place_saved.city
        place_saved.country = country ?? place_saved.country
        place_saved.name = name ?? place_saved.name
        place_saved.state = state ?? place_saved.state
        place_saved.street = street ?? place_saved.street
        place_saved.neighborhood = neighborhood ?? place_saved.neighborhood
        try {
            await place_saved.save()
            return response.status(204).send()

        } catch (e) {
            return response.status(422).json(e)
        }

    }
    async find(request: Request, response: Response) {
        return response.json(await Place.findById(parseInt(request.params.id)))
    }
}

export const placesController = new PlacesController();