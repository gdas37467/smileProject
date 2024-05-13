import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNavbar from '../Components/AdminNavbar'
import { jwtDecode } from 'jwt-decode'
import Registration from '../Components/Registration'







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
                            navigate('/admin')
                        }
                    })
            }else if(!jwtDecode(JSON.parse(localStorage.getItem('adminCheck')).isAdmin)){
                Swal.fire({
                    title : 'You are not authorized to view this Page!',
                    text :  'Pleaase Login with correct Admin Credentials to Continue!',
                    icon : 'warning'
                }).then((res)=>{
                    if(res.isConfirmed || res.dismiss === 'backdrop'){
                        navigate('/admin')
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
                    navigate('/admin')
                }
            })
        }

    },[])

    
    
    
    
    return (
        <>
            <AdminNavbar />
            <div className="admin_outer_div">
                <div className="admin_dashboard">
                    <Registration />
                </div>
            </div>
        </>
    )
}

export default Register