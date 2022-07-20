import { Request, Response } from "express";

class HomeController {
    index( request : Request, response :Response ){
        return response.json({ greating: 'Olá, bem vindo a minha API' });
    }
}

export const homeController =  new HomeController();