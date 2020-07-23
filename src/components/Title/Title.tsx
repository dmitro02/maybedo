import React from 'react'
import './Title.scss'
import { debounceInput } from '../../utils'

interface IProps { title: string, setTitle: Function }

const Title = ({ title, setTitle }: IProps) => {
    const handleInput = debounceInput((text: string) => setTitle(text)) 

    return (
        <header
            contentEditable="true"
            suppressContentEditableWarning={true}
            onInput={handleInput}
        >
            {title}
        </header>
    )
}

export default Title