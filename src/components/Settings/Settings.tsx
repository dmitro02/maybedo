import './Settings.scss'
import ExportImport from './ExportImport' 
import SyncSettings from './SyncSettings'

type Props = {
    backToTaskList(): void
}

const Settings = (props: Props) => {

    const { backToTaskList } = props

    return (
        <div className="settings">
            <ExportImport backToTaskList={backToTaskList} />
            <div className="divider" />
            <SyncSettings />
        </div>
    )
}

export default Settings
