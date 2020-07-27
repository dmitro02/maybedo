import React from 'react'
import './Projects.scss'
import SideBarItem from './SideBarItem'
import Divider from '../Divider/Divider'

interface IProps {}

const Projects = () => {

    return (
        <div className="projects">
            <header>Projects</header>
            <Divider />
            <SideBarItem />
        </div>  
    )
}

export default Projects