import { useRef } from 'react'
import DropboxConnector from '../../classes/DropboxConnector'
import { FailureBanner, SuccessBanner } from '../Banner/Banner'
import syncer from '../../classes/Syncer'
import { GoArrowRight } from "react-icons/go";
import Button from '../Buttons/Button'
import { store } from '../../classes/Store2'

const DropboxSettings = () => {
    const dbx = new DropboxConnector()

    const authTokenRef = useRef<HTMLInputElement>(null)

    const authorizeApp = async () => {
        store.showLoading = true
        try {
            await dbx.authorize(authTokenRef.current?.value)

            syncer.init(dbx)
            store.banner = new SuccessBanner('Application successfully authorized')
        } catch(e) {
            store.banner = new FailureBanner('Error: ' + e.message)
        }
        store.showLoading = false
    }

    return (
        <>
            <h3>
                Connect Dropbox
                {dbx.isConfigured
                    ? <span className="is-authorized already-authorized" title="Already configured">
                        &#10004;
                    </span>
                    : <span className="is-authorized not-authorized" title="Not configured">
                        !
                    </span>
                }
            </h3>
            <div className="dropbox-flow">
                <Button text='get code' action={()=> window.open(dbx.authUrl, "_blank")} />
                <GoArrowRight className="arrow-right" />
                <input 
                    type="text" 
                    size={48} 
                    placeholder="insert authorizarion code here"
                    ref={authTokenRef}
                    className="auth-code"
                />
                <GoArrowRight className="arrow-right" />
                <Button text='authorize' action={authorizeApp} />
            </div>
        </>
    )
}

export default DropboxSettings
