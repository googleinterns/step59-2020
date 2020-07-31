import Background from "../assets/background.jpg";

export const body = {
    fontFamily: "Calibri",
    textAlign: "center",
    backgroundImage: "url("+Background+")",
    minHeight: '105vh',
    minWidth: '100%',
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

export const dropdown = {
    width: '60%',
    marginTop: '2rem',
    zIndex: '1',
}

export const box = {
    background: 'rgba(255,255,255,95%)',
    fontWeight: 'bold',
    borderRadius: '10px',
    padding: '10px',
    width: '60%',
    fontSize: '30px',
    backgroundOpacity: '0.6',
    margin: 'auto',
    marginBottom: '1rem',
    boxShadow: '0 3px 5px 2px rgba(0,0,0,.3)'
}

export const imgGrid = {
    margin: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(2,1fr)',
}

export const img = {
    shadow: '2px 2px 4px #000000',
    height: '400px',
    margin: 'auto',
    marginTop: '10px',
    marginBottom: '10px',
}