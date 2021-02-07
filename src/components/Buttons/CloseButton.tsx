import { memo } from 'react'
import './Button.scss'

type Props = {
    action: (e: any) => void
    classNames?: string[]
}

const CloseButton = (props: Props) => {
    const {
        action,
        classNames = []
    } = props

    return (
        <button 
            className={`material-icons common-btn close-btn${classNames.join(' ')}`} 
            onClick={action}
        >close</button>
    )
}

export default memo(CloseButton)