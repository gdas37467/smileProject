import React, {  useEffect, useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom'
import LoginPage from '../Components/LoginPage'
import {jwtDecode} from 'jwt-decode'
import {motion} from 'framer-motion'




const RequestBlood = () => {
    axios.defaults.withCredentials=true
    
    const navigate = useNavigate()

        // Storing csrftoken
        async function token(){
            try {
                const res1 = await axios.get('http://192.168.29.55:8000/api/v1/adminUser/get_csrf_token/')
                localStorage.setItem('csrfToken' , res1.data.csrfToken)
            } catch (error) {
                toast.error(error)
            }
        }
    
    useEffect(()=>{
        token()
        const now = new Date().getTime()
        if(localStorage.getItem('check') !== null){
            if(JSON.parse(localStorage.getItem('check')).expire > now ) {
                if(jwtDecode(JSON.parse(localStorage.getItem('check')).user).isRecipient){
                    navigate('/request/requestdashboard')
                }
            }else{
                localStorage.removeItem('check')
            }
        }
    },[])

    return (
        <>

                <div className="request_outer_div">
             
                        <div className="request_register">
                            <motion.div className="request_registration_form"
                                initial={{x : '-100vw'}}
                                animate={{x : 0}}
                            >
                                <LoginPage 
                                    type="recipientLogin"
                                />
                            </motion.div>
                            <ToastContainer />
                        </div>
                   
                </div>
        </>
    )
}

export default RequestBlood