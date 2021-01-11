import DropboxClient from './DropboxClient'
import { Task } from '../types';

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

    async getMetadata() {
        const response: any = await this.dropboxCon.downloadFile(METADATA_FILE_PATH)
        return response.result
    }

    async uploadMetadata(metadata: any) {
        const contents = JSON.stringify(metadata)
        return await this.dropboxCon.uploadFile(contents, METADATA_FILE_PATH)
    }

    async downloadTaskList(): Promise<Task> {
        const latestExport = await this.getLatestExport()
        const latestExportJson = await this.readFile(latestExport.fileBlob)
        return JSON.parse(latestExportJson as string)
    } 
    
    async uploadTaskList(taskList: Task) {
        const contents = JSON.stringify(taskList)
        const path = `${DATA_FOLDER_PATH}/tasklist_${new Date().toISOString()}.json`
        return await this.dropboxCon.uploadFile(contents, path)
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