import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { App } from "./App";

@Entity()
export class AppToUser {
    @PrimaryGeneratedColumn()
    public apptoUserId!: number;

    @Column({ unique: true})
    public email!: string;

    @Column()
    public id_app!: string;

    // @Column()
    // public order!: number;

    @ManyToOne(() => User, user => user.appToUsers)
    public user!: User;

    @ManyToOne(() => App, app => app.appToUsers)
    public app!: App;
}