import React from 'react'
import './Record2.scss'

const Record2 = () => {
    const showDeleteConfirmation = false
 
    return (
        <>
            <div className="record2">
                <div className="left-btns">
                    <i className="material-icons">drag_indicator</i>
                    <i className="material-icons">check_box_outline_blank</i>
                </div>
                <div className="content" contentEditable>to-do text</div>
                <div className="right-btns">
                    <i className="material-icons">add</i>  
                    <i className="material-icons">clear</i>
                    {showDeleteConfirmation && 
                        <div className="">
                            <button>Yes</button> 
                            <button>No</button>   
                        </div>
                    } 
                </div>
 
            </div>
        </>
    )
}

export default Record2
