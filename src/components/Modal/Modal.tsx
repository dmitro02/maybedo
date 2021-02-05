import './Modal.scss'
import { useTasksContext } from '../../contexts/TasksContext'
import Fog from '../Fog/Fog'

const Modal = () => {
    const { store: { modal } } = useTasksContext()

    if (!modal) return null

    return (
        <>
            <Fog isDisplayed={true} />
            <div className="modal-container">
                <div className="modal-dialog">
                    {modal}
                </div>
            </div>
        </>
    )
}

export default Modal
