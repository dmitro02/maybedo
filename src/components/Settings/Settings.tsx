import './Settings.scss'
import ExportImport from './ExportImport' 
import Divider from '../Divider/Divider'
import SyncSettings from './SyncSettings'

type Props = {
    backToTaskList(): void
}

const Settings = (props: Props) => {

    const { backToTaskList } = props

    return (
        <div className="settings">
            <ExportImport backToTaskList={backToTaskList} />
            <Divider />
            <SyncSettings />
        </div>
    )
}

export default Settings
