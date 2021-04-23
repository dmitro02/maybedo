import { readFile } from '../utils/commonUtils';
import { ICloudConnector, SyncTargets } from './Syncer';
import DropboxClient from './DropboxClient'

const CLIENT_ID = 'lxn28fv9hhsn7id'

const DATA_FOLDER_PATH = '/data'
const METADATA_FILE_PATH = '/metadata.json'

export default class DropboxConnector implements ICloudConnector {
    private dropboxClient: DropboxClient

    syncTarget = SyncTargets.Dropbox

    constructor() {
        this.dropboxClient = new DropboxClient(CLIENT_ID)
    }

    get authUrl(): string {
        return this.dropboxClient.authUrl
    }

    get isConfigured(): boolean {
        return this.dropboxClient.isConfigured
    }

    async authorize(authorizationCode?: string)  {
        await this.dropboxClient.authorize(authorizationCode)
    }

    async check() {
        await this.dropboxClient.check()
    }

    async downloadItems(names: string[]): Promise<any[]> {
        const files = []
        for (const name of names) {
            const path = `${DATA_FOLDER_PATH}/${name}.json`
            const response: any = await this.dropboxClient.downloadFile(path)
            const fileContent = await readFile(response.result.fileBlob)
            files.push(JSON.parse(fileContent as string))
        }
        return files
    }

    async uploadItems(files: string[][]): Promise<void> {
        for (const file of files) {
            const path = `${DATA_FOLDER_PATH}/${file[1]}.json`
            await this.dropboxClient.uploadFile(file[0], path)
        }
    }

    async deleteItems(names: string[]): Promise<void> {
        for (const name of names) {
            const path = `${DATA_FOLDER_PATH}/${name}.json`            
            await this.dropboxClient.deleteFile(path)
        }
    }

    async downloadMetadata(): Promise<string> {        
        try {
            const response: any = await this.dropboxClient.downloadFile(METADATA_FILE_PATH)
            return await readFile(response.result.fileBlob)
        } catch(e) {
            return ''
        }
    }

    async uploadMetadata(metadata: string) {
        await this.dropboxClient.uploadFile(metadata, METADATA_FILE_PATH)
    }
}
