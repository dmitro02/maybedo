import DropboxConnector from './DropboxConnector'
import { Task } from './../types';
import { 
    convertDataToJson, 
    getExportFileNameJson 
} from './exportImportUtils';

const CLIENT_ID = 'lxn28fv9hhsn7id'

export default class DropboxSync {
    private dropboxCon: DropboxConnector

    constructor() {
        this.dropboxCon = new DropboxConnector(CLIENT_ID)
    }

    get authUrl(): string {
        return this.dropboxCon.authUrl
    }

    async auhtorize(authorizationCode: string)  {
        await this.dropboxCon.authorize(authorizationCode)
    }

    async download() {
        const latestExport = await this.getLatestExport()
        const latestExportJson = await this.readFile(latestExport.fileBlob)
        return JSON.parse(latestExportJson as string)
    } 
    
    async upload(root: Task) {
        const contents = convertDataToJson(root)
        const path = '/' + getExportFileNameJson()
        return await this.dropboxCon.uploadFile(contents, path)
    }

    private async getSortedExports() {
        const response: any = await this.dropboxCon.listAppFolder()
        return response.result.entries.sort((a: any, b: any) => {
            const clientModifiedA = new Date(a.client_modified)
            const clientModifiedB = new Date(b.client_modified)
            if (clientModifiedA < clientModifiedB)
                return -1
            if (clientModifiedA > clientModifiedB)
                return 1
            return 0
        })
    }

    private async getLatestExport() {
        const sortedExports = await this.getSortedExports()
        const path = sortedExports.pop().path_lower
        const response: any = await this.dropboxCon.downloadFile(path)
        return response.result
    }

    private readFile(blob: Blob) {
        return new Promise((resolve, reject) => {
            const fr = new FileReader()
            fr.onerror = reject
            fr.onload = () => resolve(fr.result)
            fr.readAsText(blob)
        })
    }
}