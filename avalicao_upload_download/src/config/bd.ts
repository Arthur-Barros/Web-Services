import { MongoClient } from 'mongodb'

import { app } from '../app'

const URI_BD = process.env.URI_BD

export const conectarBD = async () => {
    const clienteMongo = new MongoClient(URI_BD, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })


    try {
        const conexao = await clienteMongo.connect()
        app.locals.bd = conexao.db()
        console.log(`App finalizado ao bd ${conexao.db().databaseName}`)

        process.on('SIGINT', async () => {
            try {
                await conexao.close()
                console.log('Conexão com o BD finalizado')
            } catch (erro) {
                console.log(erro)
            }
        })
    } catch (erro) {
        console.log(erro)
    }
}