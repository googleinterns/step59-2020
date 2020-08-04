import React,{Component,Fragment} from 'react';
import Background from "../assets/background.jpg";

export const h1 = {
    fontWeight: 'bold',
    fontSize: '30px',
}

export const body = {
    fontFamily: "Calibri",
    backgroundImage: "url("+Background+")",
    minHeight: '100vh',
    minWidth: '100%',
    textAlign: 'center'
}

export const center = {
    alignContent:'center',
    justifyContent:'center',
}

export const box = {
    background: 'white',
    borderRadius: '10px',
    padding: '10px',
    width: '60%',
    fontSize: '30px',
    opacity: '0.7',
    margin: 'auto',
    shadow: '10px 10px 40px 7px rbga(0,0,0,0.5)',
}

export const displayAlign = {
    position: 'relative',
    display:'flex',
    justifyContent:'center'
}

export const centerButtonStyle = {
    background: 'linear-gradient(45deg,#FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    padding: '50px',
    boxShadow: '0 3px 5px 2px rgba(255,105,135,.3)',
}

export const buttonStyle = {
    background: 'linear-gradient(45deg,#FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    padding: '50px',
    boxShadow: '0 3px 5px 2px rgba(255,105,135,.3)',
    align: 'center',
    width: '20rem',
    marginTop: '1rem',
    margin: '1rem 1rem 1rem 1rem'
}

export const disabledButtonStyle = {
    background: 'gray',
    borderRadius: 3,
    border: 0,
    color: 'white',
    padding: '50px',
    boxShadow: '0 1px 2px 2px',
    align: 'center',
    width: '20rem',
    margin: '1rem 1rem 1rem 1rem'
}

