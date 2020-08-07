import Background from "../assets/background.jpg";

export const body = {
    fontFamily: "Calibri",
    backgroundImage: "url("+Background+")",
    minHeight: '105vh',
    minWidth: '100%',
}

export const box = {
    background: 'rgba(255,255,255,0.8)',
    fontWeight: 'bold',
    borderRadius: '10px',
    fontSize: '30px',
    backgroundOpacity: '0.6',
    margin: 'auto',
    marginTop: '1rem',
    marginBottom: '1rem',
    marginLeft: '2rem',
    marginRight: '2rem',
    textAlign: 'center',
    boxShadow: '0 3px 5px 2px rgba(0,0,0,.3)'
}

export const buttonStyle = {
    background: 'linear-gradient(45deg,#FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    padding: '20px',
    boxShadow: '0 3px 5px 2px rgba(255,105,135,.3)',
    align: 'center',
    width: '8rem',
    marginTop: '1rem',
    margin: '1rem 1rem 1rem 1rem',
    zIndex: '1',
}

export const smallFont = {
    fontSize: '18px',
    opacity: '80%',
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