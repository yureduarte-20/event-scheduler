import { Response } from "express";
import connection from "../database/connection";
import { AutenticatedRequest } from "../middleware/auth.middleware";
import { IPlace, IUserPlaces, Place } from "../Model/place.model";

class PlacesController {
    async create(request : AutenticatedRequest, response : Response){
        const place : IPlace = request.body
        const { userId } = request;
        try{
           const id : any = await Place.create(place);
           const id_user_place : any = await connection.insert<IUserPlaces>({ user_id : userId, place_id: id[0] }).into("user_places")
           return response.status(201).json({id:id[0], id_user_place: id_user_place[0]})
        }catch(e){
            console.log(e)
            return response.status(422).json(e);
        }
    }
}

export const placesController = new PlacesController();