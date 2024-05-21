import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNavbar from '../Components/AdminNavbar'
import { jwtDecode } from 'jwt-decode'
import Registration from '../Components/Registration'
import Swal from 'sweetalert2'
import { Button } from '@mui/material'







const Register = () => {
    axios.defaults.withCredentials = true
    
    const navigate = useNavigate()


    // Page validation
    useEffect(() => {
        if(localStorage.getItem('adminCheck') !== null){
            const now = new Date().getTime()
            if(JSON.parse(localStorage.getItem('adminCheck')).expire < now ){
                    Swal.fire({
                        title: 'Session Expired! Please Login Again!',
                        icon : 'warning'
                    }).then((res)=>{
                        if(res.isConfirmed || res.dismiss === 'backdrop'){
                            localStorage.removeItem('adminCheck')
                            navigate('/admindashboard')
                        }
                    })
            }else if(!jwtDecode(JSON.parse(localStorage.getItem('adminCheck')).isAdmin)){
                Swal.fire({
                    title : 'You are not authorized to view this Page!',
                    text :  'Pleaase Login with correct Admin Credentials to Continue!',
                    icon : 'warning'
                }).then((res)=>{
                    if(res.isConfirmed || res.dismiss === 'backdrop'){
                        navigate('/admindashboard')
                    }
                })
            }else{
            }
        }else{
            Swal.fire({
                title : 'You are not authorized to view this Page',
                text : 'Pleaase Login with correct Admin Credentials to Continue!',
                icon : 'warning'
            }).then((res)=>{
                if(res.isConfirmed || res.dismiss === 'backdrop'){
                    navigate('/admindashboard')
                }
            })
        }

    },[])

    
    //Admin Logout
    const adminLogout = () => {
        try{
            axios.get('http://192.168.29.55:8000/api/v1/adminUser/admin_logout/').then((res)=>{
                localStorage.removeItem('adminCheck')
                Swal.fire({
                    title : 'Logout Successful',
                    icon : 'success',
                }).then((res) =>{
                    if(res.isConfirmed || res.dismiss === 'backdrop'){
                        navigate('/admindashboard')
                    }
                })
            })
        }catch(err){
            Swal.fire({
                title : 'Something Went Wrong',
                icon : 'error'
            })
        }
    }
    
    return (
        <>
            <AdminNavbar />
            <div className="admin_outer_div">
                <div className="admin_dashboard">
                    <div className="logout">
                        <Button variant='contained' onClick={adminLogout}
                            sx={{
                                backgroundColor : '#d71414',
                                borderRadius : '2.5rem',
                                color : '#f0e3e4',
                                fontWeight : 'bold',
                                fontSize : '1rem',
                                "&:hover" : {
                                    backgroundColor : '#d71414',
                                    color : '#f0e3e4',
                                }
                            }}
                        >
                            Logout
                        </Button>
                    </div>
                    <Registration />
                </div>
            </div>
        </>
    )
}

export default Register