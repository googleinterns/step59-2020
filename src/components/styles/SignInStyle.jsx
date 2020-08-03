import Background from "../assets/background.jpg";

export const body = {
    fontFamily: "Calibri",
    textAlign: "center",
    backgroundImage: "url("+Background+")",
    minHeight: '100vh',
    minWidth: '100%',
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

export const buttonStyle = {
    background: 'linear-gradient(45deg,#FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    padding: '20px',
    boxShadow: '0 3px 5px 2px rgba(255,105,135,.3)',
    align: 'center',
    width: '18rem',
    marginTop: '1rem',
    margin: '1rem 1rem 1rem 1rem'
}

export const h1 = {
    fontWeight: 'bold',
    fontSize: '30px',
}
