import { memo } from 'react'
import './Button.scss'

type Props = {
    action: () => void
    classNames?: string[]
    title?: string
}

const MenuButton = (props: Props) => {
    const {
        action,
        classNames = [],
        title = ''
    } = props

    const handleClick = (e: any) => {
        e.stopPropagation()
        action()
    }

    return (
        <i 
            className={`material-icons common-btn ${classNames.join(' ')}`} 
            onClick={handleClick}
            title={title}
        >menu</i>
    )
}

export default memo(MenuButton)