import {Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { randomBytes, pbkdf2Sync} from 'crypto'
import { validate } from 'email-validator'
import { AppToUser } from "./AppToUser";

export enum STATUS {
    INVALID_EMAIL = 'Invalid e-mail',
    INVALID_NAME = 'Invalid name',
    INVALID_PASSWORD = 'The password must contain at least 8 characters, 1 uppercase character, and 1 digit',
    OK = 'OK',
    REGISTER_ERROR = 'An error occurred while trying to register the user',
    NOT_AUTHORIZED = 'User not authorized',
    EMAIL_EXISTING = 'E-mail already exists',
    REGISTERED_EMAIL = 'User email is not registered',
    EMAIL_REGISTERED_FOR_APP = 'You are already registered for this app',
    ASSOCIATE_FAIL = 'It was not possible to associate'
}

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    email: string;

    @Column()
    name: string;

    @Column()
    salt: string;

    @Column()
    hash: string;

    _password: string

    @OneToMany(() => AppToUser, appTouser => appTouser.user)
    public appToUsers!: AppToUser[];

    constructor(email: string, name: string, password: string){
        this.email = email
        this.name = name
        this._password = password
        this._genaratePassword()
    }

    isValid(): STATUS {
        if(!validate(this.email)) {
            return STATUS.INVALID_EMAIL
        }  

       
        if(!this.name || this.name.length == 0){
            return STATUS.INVALID_NAME
        }

        if(!this._isPasswordValid()){
            return STATUS.INVALID_PASSWORD
        }

        return STATUS.OK
    }

    isPasswordCorrect(password: string): boolean{
        const hash = pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')
        return hash == this.hash
    }

    private _genaratePassword() {
        if(this._isPasswordValid()) {
            const salt = randomBytes(16).toString('hex')
            const hash = pbkdf2Sync(this._password, salt, 1000, 64, 'sha512').toString('hex')
            this.salt = salt
            this.hash = hash
            
        }
    }

    private _isPasswordValid(): boolean {
        return this._password
            && this._password.length >= 8
            && /[A-Z]/g.test(this._password)
            && /[0-9]/g.test(this._password)
    }

}
