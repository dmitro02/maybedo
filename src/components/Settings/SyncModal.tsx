import withModal from "../../HOCs/withModal"

type Props = {
    onLocal: () => void
    onRemote: () => void
}

const SyncModal = (props: Props) => {
    const {
        onLocal,
        onRemote
    } = props

    return (
        <>
            <div>Select initial data source</div>
            <div>
                <button onClick={onLocal}>Local</button>
                <button onClick={onRemote}>Remote</button>
            </div>
        </>
    )
}

export default withModal(SyncModal)
