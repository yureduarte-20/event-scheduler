import { query, Request, Response } from "express";
import { Place, IPlace } from "../model/place.model";
import apispecifications from '../openapi.json'
import { setup } from 'swagger-ui-express'
class HomeController {
    index(request: Request, response: Response) {
        return response.json(apispecifications)
    }
}

export const homeController = new HomeController();