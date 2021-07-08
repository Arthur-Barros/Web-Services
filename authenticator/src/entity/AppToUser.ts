import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { App } from "./App";

@Entity()
export class AppToUser {
    @PrimaryGeneratedColumn()
    public apptoUserId!: number;

    @Column()
    public email!: string;

    @Column()
    public id_app!: string;

    @ManyToOne(() => User, user => user.appToUsers)
    public user!: User;

    @ManyToOne(() => App, app => app.appToUsers)
    public app!: App;
}