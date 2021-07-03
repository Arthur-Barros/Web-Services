import {Entity, ObjectIdColumn, ObjectID, Column } from "typeorm";

export enum STATUSFORAPP {
    INVALID_SECRET = 'não e possivel cadastrar, pois já existe esse secret em um app',
    OK = 'OK',
    INVALID_ID = 'Os ids são iguais',
    NOT_AUTHORIZED = 'User not authorized',
    REGISTER_ERROR = 'App não foi registrado'
}

@Entity()
export class App {

    @ObjectIdColumn()
    id: ObjectID;

    @Column({ unique: true})
    id_app: string

    @Column()
    secret: string;

    @Column()
    expiresIn: string;

   
    constructor(id_app: string, secret: string, expiresIn: string){
        this.id_app = id_app
        this.secret = secret
        this.expiresIn = expiresIn
    }

    isValid(): STATUSFORAPP {
    //     if(this.secret === this.secret) {
    //         return STATUSFORAPP.INVALID_SECRET
    //     }  

    //    if(this.id_app === this.id_app){
    //        return STATUSFORAPP.INVALID_ID
    //    }
        // if(!this.name || this.name.length == 0){
        //     return STATUS.INVALID_NAME
        // }

        // if(!this._isPasswordValid()){
        //     return STATUS.INVALID_PASSWORD
        // }

        return STATUSFORAPP.OK
    }

    // isPasswordCorrect(password: string): boolean{
    //     const hash = pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')
    //     return hash == this.hash
    // }

    // private _genaratePassword() {
    //     if(this._isPasswordValid()) {
    //         const salt = randomBytes(16).toString('hex')
    //         const hash = pbkdf2Sync(this._password, salt, 1000, 64, 'sha512').toString('hex')
    //         this.salt = salt
    //         this.hash = hash
            
    //     }
    // }

    // private _isPasswordValid(): boolean {
    //     return this._password
    //         && this._password.length >= 8
    //         && /[A-Z]/g.test(this._password)
    //         && /[0-9]/g.test(this._password)
    // }

}
