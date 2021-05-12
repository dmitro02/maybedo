import { useEffect, useState } from "react"
import { useEvent, notify, Events } from "../../classes/Store"
import Task from "../../classes/Task"
import Editable from "../Record/Editable"
import RecordMenu from "../RecordMenu/RecordMenu"

type Props =  {
    item: Task
    isEditable?: boolean,
    remove?: (task: Task) => void
}

const Title = (props: Props) => {
    const { 
        isEditable = true,
        item,
        item: { text, id },
        remove = () => {}
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
        <div className="title">
            <Editable 
                text={title} 
                onInput={updateTitle} 
                isEditable={isEditable}
                isSingleLine
            />
            <RecordMenu
                task={item}
                isTitle
                remove={remove}
            />
        </div>
    )
}

export default Title
