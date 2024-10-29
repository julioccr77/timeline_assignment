import './ZoomControls.css';

import React from 'react';
import zoomInIcon from "../../assets/zoomIn.svg"
import zoomOutIcon from "../../assets/zoomOut.svg"

const ZoomControls = ({zoomOut=()=>{}, zoomIn = ()=>{}}) => {

    return (
        <div className="zoom-controls">
        <div>
            <img src={zoomOutIcon} alt="zoomOut" width="40" height="40" onClick={zoomOut}/>
            <p>Zoom out</p>
        </div>
       <div>
        <img src={zoomInIcon } alt="zoomIn" width="40" height="40" onClick={zoomIn} />
        <p>Zoom in</p>
       </div>
    </div>
    )

}

export default ZoomControls;
