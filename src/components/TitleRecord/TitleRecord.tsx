import React, { memo } from 'react'
import './TitleRecord.scss'
import Record, { RecordConfig } from '../Record/Record'
import { ITask } from '../../types'

type Props = { 
    item: ITask, 
    parent: ITask,
    isEditable: boolean
}

const TitleRecord = ({ item, isEditable, parent }: Props) => {
    const recordConfig: RecordConfig = { isEditable }

    return (
        <header>
            <Record 
                item={item} 
                config={recordConfig}
                parent={parent}
            />
        </header>
    ) 
}

export default memo(TitleRecord)
