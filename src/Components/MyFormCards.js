import React, { useEffect, useState } from 'react'
import './MyFormCard.css'
import DescriptionIcon from "@mui/icons-material/Description";
import { Link } from 'react-router-dom';

function MyFormCards({title,user}) {
    
    return (
        <Link to={`/${user?.uid}/myforms/${title}`} className="form_card">
            <div className="formcard__icon_container">
                <DescriptionIcon className="formcard_icon" />
            </div>
            <div className="formcard_details">
                <p>{title}</p>
                <span>{user?.displayName}</span>
            </div>
        </Link>
    )
}

export default MyFormCards
