import { memo } from 'react'
import './Button.scss'
import { MdMenu } from 'react-icons/md'

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
        <MdMenu 
            className={`common-btn ${classNames.join(' ')}`} 
            onClick={handleClick}
            title={title}
        />
    )
}

export default memo(MenuButton)
