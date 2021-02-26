import './Button.scss'
import { MdCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md'

type Props = {
    actionOnClick: (e: any) => void
    isChecked?: boolean,
    classes?: string[]
}

const CheckmarkButton = (props: Props) => {
    const {
        actionOnClick,
        isChecked = false,
        classes = []
    } = props

    return (
        <>
            {isChecked
                ? <MdCheckBox 
                    className={`common-btn checkmark-btn ${classes.join(' ')}`} 
                    onClick={actionOnClick}
                />
                : <MdCheckBoxOutlineBlank 
                    className={`common-btn checkmark-btn ${classes.join(' ')}`} 
                    onClick={actionOnClick}
                />
            }
        </>
    )
}

export default CheckmarkButton
