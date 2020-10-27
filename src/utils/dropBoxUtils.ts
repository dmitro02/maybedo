import { TOKEN } from '../localConfig'
import { Dropbox } from 'dropbox'
import fetch from 'isomorphic-fetch'

const dbx = new Dropbox({ accessToken: TOKEN, fetch })

export const getCurrentAccount = () => dbx.usersGetCurrentAccount()
    .then((response) => console.log(response))
    .catch((error) => console.error(error))
