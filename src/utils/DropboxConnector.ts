import DropboxClient from './DropboxClient'
import { Metadata, Task } from '../types';

const CLIENT_ID = 'lxn28fv9hhsn7id'

const DATA_FOLDER_PATH = '/data'
const METADATA_FILE_PATH = '/metadata.json'

export default class DropboxConnector {
    private dropboxCon: DropboxClient

    constructor() {
        this.dropboxCon = new DropboxClient(CLIENT_ID)
    }

    get authUrl(): string {
        return this.dropboxCon.authUrl
    }

    get isConfigured(): boolean {
        return this.dropboxCon.isConfigured
    }

    async check() {
        await this.dropboxCon.checkUser()
    }

    async auhtorize(authorizationCode?: string)  {
        await this.dropboxCon.authorize(authorizationCode)
    }

    async uploadData(metadata: Metadata, taskList: Task): Promise<boolean> {
        return this.uploadMetadata(metadata) && this.uploadTaskList(taskList)
    }

    async downloadMetadata(): Promise<Metadata> {        
        try {
            const response: any = await this.dropboxCon.downloadFile(METADATA_FILE_PATH)
            const fileContent = await this.readFile(response.result.fileBlob)
            return JSON.parse(fileContent as string)
        } catch(e) {
            return new Metadata()
        }
    }

    async uploadMetadata(metadata: Metadata): Promise<boolean> {
        try {
            const contents = JSON.stringify(metadata)
            await this.dropboxCon.uploadFile(contents, METADATA_FILE_PATH)
            return true
        } catch(e) {
            console.error(e)
            return false
        }
    }

    async downloadTaskList(): Promise<Task | null> {
        try {
            const latestExport = await this.getLatestExport()
            const latestExportJson = await this.readFile(latestExport.fileBlob)
            return JSON.parse(latestExportJson as string)            
        } catch(e) {
            console.error(e)
            return null
        }
    } 
    
    async uploadTaskList(taskList: Task): Promise<boolean> {
        if (!taskList) return false
        try {
            const contents = JSON.stringify(taskList)
            const path = `${DATA_FOLDER_PATH}/tasklist_${new Date().toISOString()}.json`
            await this.dropboxCon.uploadFile(contents, path)
            return true
        } catch(e) {
            console.error(e)
            return false
        }
    }

    private async getSortedExports() {
        const response: any = await this.dropboxCon.listFolder(DATA_FOLDER_PATH)
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