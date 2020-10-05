import React, { memo } from 'react'
import './Button.scss'

type Props = {
    actionOnMouseDown: (e: any) => void
    actionOnMouseUp: (e: any) => void
    isChecked?: boolean,
    classNames?: String[]
}

const CheckmarkButton = (props: Props) => {
    const {
        actionOnMouseDown,
        actionOnMouseUp,
        isChecked = false,
        classNames = []
    } = props

    return (
        <i 
            className={`material-icons common-btn ${classNames.join(' ')}`} 
            onMouseDown={actionOnMouseDown}
            onMouseUp={actionOnMouseUp}
        >{isChecked ? 'check_box' : 'check_box_outline_blank'}</i>
    )
}

export default memo(CheckmarkButton)