import { CloseButton, ConfirmButton } from "../Buttons/Buttons"
import withModal from "../../HOCs/withModal"

type Props = {
    onConfirm: () => void
    onCancel: () => void
}

const ImportModal = (props: Props) => {
    const {
        onConfirm,
        onCancel
    } = props

    return (
        <>
            <div>Do you want to overwrite existing data?</div>
            <div className="modal-btns">
                <CloseButton action={onCancel} />
                <ConfirmButton action={onConfirm} />
            </div>
        </>
    )
}

export default withModal(ImportModal)
