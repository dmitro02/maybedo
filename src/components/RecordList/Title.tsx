import { useEffect, useState } from "react"
import { useEvent, notify, Events } from "../../classes/Store"
import Task from "../../classes/Task"
import Editable from "../Record/Editable"

type Props =  {
    item: Task
    isEditable?: boolean
}

const Title = (props: Props) => {
    const { 
        isEditable = true,
        item: { text, id }
    } = props

    const [ title, setTitle ] = useState('')

    useEffect(() => {
        setTitle(text)
    }, [text])

    useEvent(Events.SetTitleByProject + id, setTitle)

    const updateTitle = (title: string) => {
        notify(Events.SetProjectByTitle + id, title)
    }

    return (
        <Editable 
            text={title} 
            saveContent={updateTitle} 
            isEditable={isEditable}
            isSingleLine={true}
            classes={[ 'title' ]}
        />
    )
}

export default Title
