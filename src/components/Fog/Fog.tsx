import './Fog.scss'

type Props = {
    isDisplayed: Boolean
}

const Fog = (props: Props) => {
    const { isDisplayed = false } = props

    return <div className="fog" style={{display: isDisplayed ? 'block' : 'none'}}/>
}

export default Fog