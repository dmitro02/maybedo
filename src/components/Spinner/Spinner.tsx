// https://loading.io/css/

import React from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import Fog from '../Fog/Fog'
import './Spinner.scss'

type Props = {
    type?: string
}

const Spinner = (props: Props) => {
    const [ store ] = useTasksContext()

    if (!store.spinner) return null

    const { type = 'type1' } = props

    return (
        <>
            <Fog isDisplayed={true} />
            <div className="spinner">
                <div className="lds-ring">
                    <div className={type} />
                    <div className={type} />
                    <div className={type} />
                    <div className={type} />
                </div>
            </div>
        </>
    )
}

export default Spinner