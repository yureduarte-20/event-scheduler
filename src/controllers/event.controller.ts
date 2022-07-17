import { Request, Response } from "express";
import { AutenticatedRequest } from "../middleware/auth.middleware";

class EventController {
    create(req : AutenticatedRequest, response : Response){
    
    }
}

export const eventController = new EventController();