import {Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { AppToUser } from "./AppToUser";

export enum STATUSFORAPP {
    ID_EXISTING = 'Id already exists',
    INVALID_SECRETANDID = 'It is not possible to register, as this secret already exists in an app',
    INVALID_SECRET_EMPTY = 'It is not possible to register the empty script',
    OK = 'OK',
    NOT_AUTHORIZED = 'User not authorized',
    REGISTER_ERROR = 'App has not been registered',
    ID_NOTVALID = 'Please enter a valid app id'

}

@Entity()
export class App {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    id_app: string

    @Column()
    secret: string;

    @Column()
    expiresIn: string;

    @OneToMany(() => AppToUser, appTouser => appTouser.app)
    public appToUsers!: AppToUser[];

    constructor(id_app: string, secret: string, expiresIn: string){
        this.id_app = id_app
        this.secret = secret
        this.expiresIn = expiresIn
    }

    isValid(): STATUSFORAPP {
        if(this.secret === "") {
            return STATUSFORAPP.INVALID_SECRET_EMPTY
        }  

        return STATUSFORAPP.OK
    }

}
