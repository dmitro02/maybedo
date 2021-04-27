import { setDropboxToken, getDropboxToken } from '../services/localStorageService';
import { Dropbox } from 'dropbox'
import fetch from 'isomorphic-fetch'
import { generateId } from '../utils/commonUtils'

const AUTH_URL = 'https://www.dropbox.com/oauth2/authorize'
const TOKEN_URL = 'https://api.dropbox.com/oauth2/token'

export default class DropboxClient {
    private clientId: string
    private codeVerifier: string
    private dropbox: Dropbox | null | undefined

    constructor(clientId: string) {
        this.clientId = clientId
        this.codeVerifier = generateId(43)
        this.initDropbox()
    }

    async check() {
        this.validateConfiguration()
        await this.dropbox!.checkUser({ query: 'maybedo' })
    }

    async authorize(authorizationCode: string = '') {
        const body = new URLSearchParams({
            code: authorizationCode,
            grant_type: 'authorization_code',
            client_id: this.clientId,
            code_verifier: this.codeVerifier
        })
    
        const response = await fetch(TOKEN_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body
        })
    
        const resData = await response.json()

        if (!response.ok) {
            throw new Error(resData.error_description)
        }
    
        const accessToken = resData.access_token

        setDropboxToken(accessToken)

        this.initDropbox(accessToken)
    }

    async listFolder(path?: string) {
        path = path || ''
        this.validateConfiguration()
        return await this.dropbox!.filesListFolder({ path })
    }

    async downloadFile(path: string) {
        this.validateConfiguration()
        return await this.dropbox!.filesDownload({ path })
    } 
    
    async uploadFile(contents: Object, path: string) {
        this.validateConfiguration()
        return await this.dropbox!.filesUpload({ contents, path, mode: {'.tag': 'overwrite'} })
    }

    async deleteFile(path: string) {
        this.validateConfiguration()
        return await this.dropbox!.filesDeleteV2({ path })
    }

    get authUrl(): string {
        return `${AUTH_URL}?client_id=${this.clientId}&response_type=code&code_challenge_method=plain&code_challenge=${this.codeVerifier}`
    }

    get isConfigured(): boolean {
        return !!this.dropbox
    }

    private initDropbox(token?: string) {
        const accessToken = token || getDropboxToken()
        this.dropbox = accessToken 
            ? new Dropbox({ accessToken, fetch })
            : null
    }

    validateConfiguration() {
        if (!this.dropbox) throw new Error('not_configured')
    }
}
