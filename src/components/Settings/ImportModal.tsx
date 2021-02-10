import withModal from "../../HOCs/withModal"
import { useEffect, useRef } from "react"
import Button from "../Buttons/Button"

type Props = {
    onConfirm: () => void
    onCancel: () => void
}

const ImportModal = (props: Props) => {
    const {
        onConfirm,
        onCancel
    } = props

    const cancelRef = useRef<HTMLButtonElement>(null)

    useEffect(() => { setTimeout(() => cancelRef.current?.focus(), 0) })

    return (
        <>
            <div>Do you want to overwrite existing data?</div>
            <div className="modal-btns">
                <Button 
                    text='cancel' 
                    ref={cancelRef} 
                    action={onCancel} 
                    isOutlined 
                />
                <Button 
                    text='ok' 
                    action={onConfirm} 
                    classNames={['margin-left-btn']} 
                />
            </div>
        </>
    )
}

export default withModal(ImportModal)
