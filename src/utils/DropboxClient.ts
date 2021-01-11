import { Dropbox } from 'dropbox'
import fetch from 'isomorphic-fetch'
import { nanoid } from 'nanoid'

const AUTH_URL = 'https://www.dropbox.com/oauth2/authorize'
const TOKEN_URL = 'https://api.dropbox.com/oauth2/token'
const ACCESS_TOKEN_LOCAL_STORAGE_NAME = 'dropboxAccessToken'

export default class DropboxClient {
    private clientId: string
    private codeVerifier: string
    private dropbox: Dropbox | null | undefined

    constructor(clientId: string) {
        this.clientId = clientId
        this.codeVerifier = nanoid(43)
        this.initDropbox(null)
    }

    async checkUser() {
        this.validateConfiguration()
        try {
            await this.dropbox!.checkUser({ query: 'todom' })
        } catch(e) {
            throw new Error("Failed to access Dropbox")
        }
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

        this.saveAccessTokenToLS(accessToken)

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
        return await this.dropbox!.filesUpload({ contents, path })
    }

    get authUrl(): string {
        return `${AUTH_URL}?client_id=${this.clientId}&response_type=code&code_challenge_method=plain&code_challenge=${this.codeVerifier}`
    }

    get isConfigured(): boolean {
        return !!this.dropbox
    }

    private initDropbox(token: string | null) {
        const accessToken = token || this.getAccessTokenFromLS()
        this.dropbox = accessToken 
            ? new Dropbox({ accessToken, fetch })
            : null
    }

    private saveAccessTokenToLS(accessToken: string) {
        localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_NAME, accessToken!)
    }
    
    private getAccessTokenFromLS() {
        return localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_NAME)
    }

    validateConfiguration() {
        if (!this.dropbox) throw new NotConfiguredError()
    }
}

class NotConfiguredError extends Error {
    constructor() {
        super('Dropbox connection is not configured')
        this.name = 'NotConfigured'
    }
} 