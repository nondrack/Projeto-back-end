import User from "../models/User";
import {Request, Response} from "express";

class UsersController {
    async list(,res){
        const users = await User.findAll();
        
        res.send(users)
    }
}