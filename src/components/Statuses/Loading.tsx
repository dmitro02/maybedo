import Fog from '../Fog/Fog'
import Spinner from './Spinner'
import './Loading.scss'
import { Events, useSubscribe } from '../../classes/Notifier'
import { useState } from 'react'

type Props = {
    spinnerClass?: string
}

const Loading = (props: Props) => {
    const { spinnerClass } = props

    const [ isDiplayed, setIsDisplayed ] = useState(false)

    const show = () => setIsDisplayed(true)
    const hide = () => setIsDisplayed(false)

    useSubscribe(Events.ShowLoading, show)
    useSubscribe(Events.HideLoading, hide)

    if (!isDiplayed) return null
    
    return (
        <>
            <Fog isDisplayed={true} />
            <div className="loading">
                <Spinner customClass={spinnerClass} />
            </div>
        </>
    )
}

export default Loading
