import { Router } from 'express'
import { sign } from 'jsonwebtoken'

import { AuthController } from '../controller/AuthController'
import { STATUS, User } from '../entity/User'
import { STATUSFORAPP, App } from '../entity/App'
import { SECRET } from '../config/secret'

export const authRouter = Router()

authRouter.post('/user/register', async (req, res) => {
    const { email, name, password} = req.body
    
    const user: User = new User(email, name, password)
    const response = user.isValid()

    if(response == STATUS.OK){
        const authCtrl = new AuthController()
        try{
            const savedUser = await authCtrl.registerUser(user)
            return res.json(savedUser)
        } catch(error){
            return res.status(500).json({message: STATUS.REGISTER_ERROR})
        }
    }else{
        return res.status(400).json({message: response})
    }
})

authRouter.post('/app/register', async (req,res) => {
    const { id_app, scret, expiresIn} = req.body

    const app: App = new App(id_app, scret, expiresIn)
    const response =  app.isValid()

    if(response == STATUSFORAPP.OK){
        const authCtrl = new AuthController()
        try{
            const savedApp = await authCtrl.registerApp(app)
            return res.json(savedApp)
        } catch(error){
            return res.status(500).json({message: STATUSFORAPP.REGISTER_ERROR})
        }
    }else{
        return res.status(400).json({message: response})
    }
    // const token = sign(
    //     {timestamp: new Date()},
    //     SECRET,
    //     {
    //         expiresIn: '5m'
    //     }
    // )
    //     res.json({
    //         authorized: true,
    //         token
    //     })
   
})

authRouter.post('/user/login', async (req, res) => {
    const { email, password } = req.body

    const authCtrl = new AuthController()
    const user = await authCtrl.findUserByEmail(email)
    if(user && user.isPasswordCorrect(password)){
        const token = sign(
            { user: email, timestamp: new Date()},
            SECRET,
            {
                expiresIn: '5m'
            }
        )

        res.json({
            authorized: true,
            user,
            token
        })
    } else{
        return res.status(401).json({
            authorized: false,
            message: STATUS.NOT_AUTHORIZED
        })
    }
})

authRouter.get('/arthur_secret', AuthController.verifyToken, (req, res) => {
    res.json({ secreMessage: "My subscribers are the best! They're amazing!"})
})