import { NextFunction, Request, Response } from "express"
import { getManager } from "typeorm"
import { verify } from 'jsonwebtoken'

import { STATUS, User } from "../entity/User"
import { App } from "../entity/App"
import { SECRET } from "../config/secret"
import { AppToUser } from "../entity/AppToUser"


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

    async findUserByEmail(email: string): Promise<User> {
        const user = await getManager().findOne(User, { email: email})
        return user
    }

    async findUserByEmailToApp(email: string){
        const appToUser = await getManager().find(AppToUser, { email: email })
        return appToUser
    }

    async findUserByIdToApp(id_app: string): Promise<AppToUser>{
        const appToUser = await getManager().findOne(AppToUser, { id_app: id_app })
        return appToUser
    }

    async associateUserToApp(apptoUser) {
        const appToUser =  await getManager().save(apptoUser)
        return appToUser
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