import { Request, Response } from "express";

class HomeController {
    index( request : Request, response :Response ){
        return response.json({ greating: 'Hello World' });
    }
}

export const homeController =  new HomeController();