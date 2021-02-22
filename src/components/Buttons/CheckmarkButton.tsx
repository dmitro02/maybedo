import { memo } from 'react'
import './Button.scss'
import { MdCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md'

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
        <>
            {isChecked
                ? <MdCheckBox 
                    className={`common-btn checkmark-btn ${classes.join(' ')}`} 
                    onMouseDown={actionOnMouseDown}
                    onMouseUp={actionOnMouseUp}
                />
                : <MdCheckBoxOutlineBlank 
                    className={`common-btn checkmark-btn ${classes.join(' ')}`} 
                    onMouseDown={actionOnMouseDown}
                    onMouseUp={actionOnMouseUp}
                />
            }
        </>
    )
}

export default memo(CheckmarkButton)
