import { memo } from 'react'
import './Button.scss'

type Props = {
    actionOnMouseDown: (e: any) => void
    actionOnMouseUp: (e: any) => void
    isChecked?: boolean,
    classes?: string[]
}

const CheckmarkButton = (props: Props) => {
    const {
        actionOnMouseDown,
        actionOnMouseUp,
        isChecked = false,
        classes = []
    } = props

    return (
        <i
            className={`material-icons common-btn ${classes.join(' ')}`} 
            onMouseDown={actionOnMouseDown}
            onMouseUp={actionOnMouseUp}
        >{isChecked ? 'check_box' : 'check_box_outline_blank'}</i>
    )
}

export default memo(CheckmarkButton)
