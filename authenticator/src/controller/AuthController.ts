import { NextFunction, Request, Response } from "express"
import { getManager } from "typeorm"
import { verify } from 'jsonwebtoken'

import { STATUS, User } from "../entity/User"
import { App } from "../entity/App"
import { SECRET } from "../config/secret"


export class AuthController {
    
    async registerUser(user: User){
        delete user._password
        try {        
            const savedUser = await getManager().save(user)
            return savedUser
        } catch(error){
            console.log(error)
            throw new Error(error)
        }    
    }

    async findAppById(id_app: string): Promise<App> {
        const app = await getManager().findOne(App, { id_app: id_app })
        return app
    }

    async associateUserToApp(id_app: string, email: string) {
       const userEmail = await getManager().find(User, {email: email})
       const appId = await getManager().find(App, {id_app: id_app})

      return {userEmail, appId}
    }

    async findUserByEmail(email: string): Promise<User> {
        const user = await getManager().findOne(User, { email: email})
        return user
    }

    static verifyToken(req: Request, res: Response, next: NextFunction) {
        let token = req.headers['authorization']
        if(token) {
            token = token.substring(7, token.length)
            try{
                verify(token, SECRET)
                next()
            } catch (error) {

            }
        }

        res.status(401).json({ message: STATUS.NOT_AUTHORIZED})

    }

    async registerApp(app: App): Promise<App> {
        try{
            const savedApp = await getManager().save(app)
            return savedApp
        } catch(error){
            console.log(error)
            throw new Error(error)
        }
    }

    async findAppBySecreet(secret: string): Promise<App> {
        const app = await getManager().findOne(App, {secret: secret})
        return app
    }
}