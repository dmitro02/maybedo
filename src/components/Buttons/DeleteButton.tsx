import React, { memo } from 'react'
import './Button.scss'

type Props = {
    action: (e: any) => void
    classNames?: String[]
}

const DeleteButton = (props: Props) => {
    const {
        action,
        classNames = []
    } = props

    return (
        <i 
            className={`material-icons common-btn ${classNames.join(' ')}`} 
            onClick={action}
        >delete</i>
    )
}

export default memo(DeleteButton)