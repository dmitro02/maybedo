import React from 'react'
import './Title.scss'
import { debounceInput } from '../../utils'

interface IProps { 
    title: string, 
    isEditable?: boolean, 
    setTitle?: Function 
}

const Title = ({ title, isEditable = false, setTitle }: IProps) => {
    const handleInput = setTitle 
        ? debounceInput((text: string) => setTitle(text)) 
        : undefined

    return (
        <header
            contentEditable={isEditable}
            suppressContentEditableWarning={true}
            onInput={handleInput}
        >
            {title}
        </header>
    )
}

export default Title