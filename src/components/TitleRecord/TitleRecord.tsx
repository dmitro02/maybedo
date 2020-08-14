import React, { memo } from 'react'
import './TitleRecord.scss'
import Record, { 
    RecordConfig, 
    RecordActions 
} from '../Record/Record'
import { ITask } from '../../types'

type Props = { 
    item: ITask, 
    setTitle?: Function 
}

const TitleRecord = ({ item, setTitle }: Props) => {
    const recordConfig: RecordConfig = {
        isEditable: !!setTitle
    }

    const recordActions: RecordActions = {
        updateRecord: setTitle
    }

    return (
        <header>
            <Record 
                item={item} 
                config={recordConfig} 
                actions={recordActions}
            />
        </header>
    ) 

}

export default memo(TitleRecord)