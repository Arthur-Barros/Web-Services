import { app } from './app'
import { conectarBD } from './config/bd'

const porta = process.env.PORT || 3000

const server = app.listen(
    porta, 
    () =>{
        conectarBD()
        console.log(`App ouvindo na porta ${porta}`)
    }
)

process.on('SIGINT', () => {
    server.close()
    console.log('App finalizado')
})

