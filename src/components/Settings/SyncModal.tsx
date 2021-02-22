import { useEffect, useRef } from "react"
import withModal from "../../HOCs/withModal"
import { SyncTargets } from "../../utils/Syncer"
import Button from "../Buttons/Button"

type Props = {
    target: SyncTargets
    onCancel: () => void
    onLocal: () => void
    onRemote: () => void
}

const SyncModal = (props: Props) => {
    const {
        onCancel,
        onLocal,
        onRemote,
    } = props

    const cancelRef = useRef<HTMLButtonElement>(null)

    useEffect(() => { setTimeout(() => cancelRef.current?.focus(), 0) })

    return (
        <>
            <div>Select initial data source</div>
            <div className="modal-btns">
                <Button 
                    text='cancel' 
                    ref={cancelRef} 
                    action={onCancel} 
                    isOutlined
                />
                <Button 
                    text='remote' 
                    action={onRemote}  
                    classNames={['central-btn']}
                />
                <Button 
                    text='local' 
                    action={onLocal} 
                />
            </div>
        </>
    )
}

export default withModal(SyncModal)
