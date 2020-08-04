import React from 'react';
import {NavLink} from "react-router-dom";
import {Button} from '@material-ui/core';

const homeButtonStyle = {
    align: 'left',
    background: 'linear-gradient(45deg,#FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    boxShadow: '0 3px 5px 2px rgba(255,105,135,.3)',
    color: 'white',
    flexGrow: '1',
    marginTop: '1rem',
    margin: '1rem 1rem 1rem 1rem',
    padding: '20px',
    width: '8rem',
    zIndex: '1',
}

function HomeButton () {
    return (
        <NavLink to="/" style={{textDecoration: 'none'}}>
            <Button style={homeButtonStyle}>
                Home
            </Button>
        </NavLink>
    );
}

export default HomeButton;