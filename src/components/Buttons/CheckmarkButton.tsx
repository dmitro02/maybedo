import './Button.scss'
import { MdCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md'

type Props = {
    actionOnClick: (e: any) => void
    isChecked?: boolean,
    priority: number
}

const CheckmarkButton = (props: Props) => {
    const {
        actionOnClick,
        isChecked = false,
        priority
    } = props

    const classes = [ 
        'common-btn', 
        'checkmark-btn', 
        isChecked ? 'prio-0' : 'prio-' + priority 
    ].join(' ')

    return (
        <>
            {isChecked
                ? <MdCheckBox 
                    className={classes} 
                    onClick={actionOnClick}
                />
                : <MdCheckBoxOutlineBlank 
                    className={classes} 
                    onClick={actionOnClick}
                />
            }
        </>
    )
}

export default CheckmarkButton
