import { useRef } from 'react'
import DropboxConnector from '../../classes/DropboxConnector'
import { FailureBanner, SuccessBanner } from '../Banner/Banner'
import syncer, { SyncSources } from '../../classes/Syncer'
import { GoArrowRight } from "react-icons/go";
import Button from '../Buttons/Button'
import { actions } from '../../classes/Store'

type Props = { source: SyncSources }

const DropboxSettings = ({ source }: Props) => {
    const dbx = new DropboxConnector()

    const authTokenRef = useRef<HTMLInputElement>(null)

    const authorizeApp = async () => {
        actions.showLoading()
        try {
            await dbx.authorize(authTokenRef.current?.value)

            syncer.initSync(source, dbx)
            const banner = new SuccessBanner('Application successfully authorized')
            actions.showBanner(banner)
        } catch(e) {
            const banner = new FailureBanner('Error: ' + e.message)
            actions.showBanner(banner)
        }
        actions.hideLoading()
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
