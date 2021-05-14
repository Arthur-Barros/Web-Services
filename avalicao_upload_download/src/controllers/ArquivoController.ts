import { createReadStream, existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs'
import { Db,  GridFSBucket, ObjectId } from 'mongodb'
import {join} from 'path'



export enum ErroUpload {
    OBJETO_ARQUIVO_INVALIDO = 'Objeto de arquivo inválido',
    NAO_FOI_POSSIVEL_GRAVAR = 'Não foi possivel gravar o arquivo'
}

export enum ErroDownload {
    ID_INVALIDO = 'ID inválido',
    NENHUM_ARQUIVO_ENCONTRADO = 'Nenhum arquivo encontrado com este id',
    NAO_FOI_POSSIVEL_GRAVAR = 'Não foi possivel gravar o arquivo recuperado'
}

export class ArquivoController {
    private _bd: Db
    private _caminhoDiretorioArquivos: string

    constructor(bd: Db){
        this._bd = bd
        this._caminhoDiretorioArquivos = join(__dirname, '..', '..', 'arquivos_temp')
        if(!existsSync(this._caminhoDiretorioArquivos)){
            mkdirSync(this._caminhoDiretorioArquivos)
        }
    }

    private _ehUmObjetoDeArquivoValido(objArquivo: any): boolean {
        return objArquivo
        && 'name' in objArquivo
        && 'data' in objArquivo
        && objArquivo['name']
        && objArquivo['data']
    }

    private _inicilizarBucket(): GridFSBucket {
        return new GridFSBucket(this._bd, {
            bucketName: 'Arquivos'
        })
    }

    realizarUpload(objArquivo: any): Promise<ObjectId>{
        return new Promise((resolve, reject) => {

            if (this._ehUmObjetoDeArquivoValido(objArquivo)) {
                const bucket = this._inicilizarBucket()

                const nomeArquivo = objArquivo['name']
                const conteudoArquivo = objArquivo['data']
                const nomeArquivoTemp = `${nomeArquivo}_${(new Date().getTime())}`

                const caminhoArquivoTemp = join(this._caminhoDiretorioArquivos, nomeArquivoTemp)

                writeFileSync(caminhoArquivoTemp, conteudoArquivo)


                const streamGridFS = bucket.openUploadStream(nomeArquivo, {
                    metadata: {
                        mimeType: objArquivo['mimetype']
                    },
                    
                    contentType: 'image/jpeg'
                })

                // if(!nomeArquivo || nomeArquivo.length === 0){
                //     console.log('não tem arquivo')
                // }else{
                //     nomeArquivo.map(nomeArquivo => {
                //         if (
                //             nomeArquivo.contentType === 'image/png' 
                //           ) {
                //             nomeArquivo.isImage = true;
                //           } else {
                //             nomeArquivo.isImage = false;
                //         }
                //     })
                // }
                    
                    
                

                const streamLeitura = createReadStream(caminhoArquivoTemp)
                streamLeitura
                    .pipe(streamGridFS)
                    .on('finish', () => { 
                        unlinkSync(caminhoArquivoTemp)
                        resolve(new ObjectId(`${streamGridFS.id}`))
                    })
                    .on('error', erro => {
                        console.log(erro)
                        reject(ErroUpload.NAO_FOI_POSSIVEL_GRAVAR)
                    })
                
            }else{
                reject(ErroUpload.OBJETO_ARQUIVO_INVALIDO)
            }
        })
    }
    
}