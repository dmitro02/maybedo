import React from 'react'
import './Title.scss'

interface IProps { title: string }

const Title = ({ title }: IProps) => {
    const debouncedInputHandler = () => {
        let timeout: any
        return (e: any) => {
            const text = e.target.textContent
            clearTimeout(timeout)
            timeout = setTimeout(() => title = text, 700)
        }
    }

    return (
        <header
            contentEditable="true"
            suppressContentEditableWarning={true}
            onInput={debouncedInputHandler()}
        >
            {title}
        </header>
    )
}

export default Title