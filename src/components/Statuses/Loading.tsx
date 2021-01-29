import Fog from '../Fog/Fog'
import Spinner from './Spinner'
import './Loading.scss'

type Props = {
    spinnerClass?: string
}

const Loading = (props: Props) => {
    const { spinnerClass } = props

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