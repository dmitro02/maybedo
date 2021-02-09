import './withModal.scss'
import Fog from '../components/Fog/Fog'

const withModal = <P extends object>(WrapedComponent: React.ComponentType<P>) => {

    return (props: any) => (
        <>
            <Fog isDisplayed={true} />
            <div className="modal-container">
                <div className="modal-dialog">
                    <WrapedComponent {...props} />
                </div>
            </div>
        </>
    )
}

export default withModal
