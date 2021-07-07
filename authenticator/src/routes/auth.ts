import { Router } from 'express'
import { sign } from 'jsonwebtoken'

import { AuthController } from '../controller/AuthController'
import { STATUS, User } from '../entity/User'
import { STATUSFORAPP, App } from '../entity/App'
import { SECRET } from '../config/secret'
import { AppToUser } from '../entity/AppToUser'

export const authRouter = Router()

authRouter.post('/user/register', async (req, res) => {
    const { email, name, password} = req.body
    
    const user: User = new User(email, name, password)
    const response = user.isValid()

    if(response == STATUS.OK){
        const authCtrl = new AuthController()
        const userEmail = await authCtrl.findUserByEmail(email)
        try{
            email == userEmail.email
            return res.status(500).json({message: 'email já existe'})
        } catch(error){
        }
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
    const { id_app, secret, expiresIn} = req.body

    const app: App = new App(id_app, secret, expiresIn)
    const response =  app.isValid()
    
    if(response == STATUSFORAPP.OK){
        const authCtrl = new AuthController()
        const secretBD = await authCtrl.findAppBySecreet(secret)
        const idAppBD = await authCtrl.findAppById(id_app)
        try{
            id_app == idAppBD.id_app
            return res.status(500).json({message: 'id já existe'})
        } catch(error){

        }
        try{
            secret == secretBD.secret
            return res.status(500).json({message: STATUSFORAPP.INVALID_SECRETANDID})
        } catch(error){

        }
        try{
            const savedApp = await authCtrl.registerApp(app)
            return res.json(savedApp)
        } catch(error){
            return res.status(500).json({message: STATUSFORAPP.REGISTER_ERROR})
        }
    }else{
        return res.status(400).json({message: response})
    }
})

authRouter.post('/app/associate', async (req,res) => {
    const { email, id_app} = req.body
    
    const authCtrl = new AuthController()
    const recuperaEmail = await authCtrl.findUserByEmail(email)

    if(!recuperaEmail){
        return res.status(500).json({message: 'e-mail de usuário não está cadastrado'})
    }
    const recuperaIdapp = await authCtrl.findAppById(id_app)
   
    const appTouser = new AppToUser()
    appTouser.email = recuperaEmail.email,
   
    appTouser.id_app = recuperaIdapp.id_app

    if(await authCtrl.findUserByEmailToApp(appTouser.email)){
        return res.status(500).json({message: 'você já está cadastrado nesse app'})
    }
       
    try{
        const savedApptoUser = await authCtrl.associateUserToApp(appTouser)
        return res.json(savedApptoUser)
    }catch(error){
        return res.status(500).json({message: 'não foi possivel associar'})
    }

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