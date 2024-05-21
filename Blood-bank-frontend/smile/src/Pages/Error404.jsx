import { Box } from '@mui/material'
import React from 'react'
import Err404 from '../assets/404Error.svg'
import { useNavigate } from 'react-router-dom'


const style = {
    height : '95vh',
    width : '100%',
    display : 'flex',
    flexDirection : 'column',
    justifyContent : 'center',
    alignItems : 'center',
    gap : '1rem',
    paddingTop : '8rem',
    '& img' : {
        height : '50rem',
        width : 'auto',
    },
    '& h3' : {
        fontSize : '1.8rem',
        fontWeight : 500,
    },
    '& h5' : {
        fontSize : '1.5rem',
        fontWeight : 300,
        cursor : 'pointer',
        textDecoration : 'underline',
        color : '#C0463B'

    },  

}

const Error404 = () => {

    const navigate = useNavigate()
    const goHome = () => {
        navigate("/")
    }

    return (
        <>
            <div className="errPage">
                <Box sx={style} >
                    <img src={Err404} alt="404 Error Page" />
                    <h3> The Page You Are Looking For Is Not Available</h3>
                    <h5 onClick={goHome}> Go back to Home Page </h5>
                </Box>
            </div>
        </>
    )
}

export default Error404