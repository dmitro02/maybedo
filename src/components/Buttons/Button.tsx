import { forwardRef } from 'react'
import './Button.scss'

type Props = {
    text: string
    action: (e: any) => void
    isOutlined?: boolean
    classNames?: string[]
}

const Button = (props: Props, ref?: React.ForwardedRef<HTMLButtonElement>) => {
    const {
        text,
        action,
        isOutlined = false,
        classNames = []
    } = props

    const classes = [ 
        'button',
        isOutlined ? 'outlined-btn' : 'filled-btn',
        ...classNames
    ].join(' ')
    
    return (
        <button 
            className={classes}
            onClick={action}
            ref={ref}
        >
            {text}
        </button>
    )
}

export default forwardRef(Button)
