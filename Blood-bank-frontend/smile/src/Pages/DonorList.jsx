import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import ComplexTable from '../Components/ComplexTable'
import AdminNavbar from '../Components/AdminNavbar'
import Swal from 'sweetalert2'
import { ToastContainer, toast } from 'react-toastify'
import {BallTriangle , FallingLines} from 'react-loader-spinner';
import { Box, Button } from '@mui/material'
import TableComp from '../Components/Table'



const tableColumn = ["Donor's Name","Total Donations"]

const DonorList = () => {
    axios.defaults.withCredentials = true

    const navigate = useNavigate()

    // const [conDonationsRows, setconDonationsRows] = useState([]);
    // const [reqRows, setReqRows] = useState([]);
    // const [apiDonorData , setApiDonorData]  = useState({})
    const [donorList , setDonorList] = useState([]);
    const [topDonorList , setTopDonorList] = useState([]);
    const [loadingPage , setLoadingPage] = useState(true)
    const [loadingApi , setLoadingApi] = useState(false)
    const [reload,setReload] = useState(false)
    

    
    // Page validation
    useEffect(() => {
        if(localStorage.getItem('adminCheck') !== null){
            const now = new Date().getTime()
            if(JSON.parse(localStorage.getItem('adminCheck')).expire < now ){
                setLoadingPage(true)
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
                setLoadingPage(true)
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
                setLoadingApi(true)
            }
        }else{
            setLoadingPage(true)
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

    
    //Send Donor For Donation
    const sentForDonation = async (id) =>{
        //API for matched donor
        console.log(id)
        try {
            const res = await axios.get(`http://192.168.1.19:8000/api/v1/adminUser/confirm_donor/${id}`)
            console.log(res)
            toast.success(res.data.success)
            setReload(!reload)

        } catch (error) {
            Swal.fire({
                text : error.response.data.error || 'Something went wrong!',
                icon : 'error',
            })
        }
    }
    //Add Loan to Donor
    const addLoan = async (id) =>{
        //API for matched donor
        console.log(id)
        try {
            const res = await axios.get(`http://192.168.1.19:8000/api/v1/adminUser/confirm_loan/${id}` )
            toast.success('Donor Added For Loan Successfully')
            setReload(!reload)

        } catch (error) {
            Swal.fire({
                text : error.response.data.error || 'Something went Wrong',
                icon : 'error',
            })
        }
    }
    //Send Donation Message to Donor
    const sendSMS = async (id) =>{
        //API for matched donor
        try {
            const res = await axios.get(`http://192.168.1.19:8000/api/v1/adminUser/send_requirement/${id}`)
            toast.success(res.data.success)
            setReload(!reload)

        } catch (error) {
            Swal.fire({
                text : error.response.data.error || 'Message Not Sent',
                icon : 'error',
            })
        }
    }
    //Send Loan Reminder to Donor
    const sendReminder = async (id) =>{
        //API for matched donor
        console.log(id)
        try {
            const res = await axios.get(`http://192.168.1.19:8000/api/v1/adminUser/loan_msg/${id}`)
            console.log(res)
            toast.success('Reminder Sent Successfully')
            setReload(!reload)

        } catch (error) {
            Swal.fire({
                text : error.response.data.error || 'Reminder Not Sent',
                icon : 'error',
            })
        }
    }
    // Delete Donor
    const deleteDonor = async (id) =>{
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete Donor!"
        }).then(async (res) => {
            if(res.isConfirmed){
                try {
                    const res = await axios.get(`http://192.168.1.19:8000/api/v1/adminUser/remove_donor/${id}`)
                    console.log(res)
                    toast.warning("Donor has been deleted!")
                    setReload(!reload)
                } catch (error) {
                    toast.error(error.response.data.error || 'Something went wrong!')
                }
            }
        })
        
    }


    const getAvailableDonors = async () => {
        setLoadingPage(true)
        try {
            const res = await axios.get('http://192.168.1.19:8000/api/v1/adminUser/get_donor_list/')
            const res1 = await axios.get('http://192.168.1.19:8000/api/v1/adminUser/get_top_donors/')
            console.log(res)
            setDonorList(res.data.donor_list)
            setTopDonorList(res1.data.donorList)
            
        } catch (error) {
            Swal.fire({
                title : error.response.data.error || 'Something went wrong!',
                icon : 'error'
            })
        }


        setLoadingPage(false)
    }

    const adminLogout = () => {
        try{
            axios.get('http://192.168.1.19:8000/api/v1/adminUser/admin_logout/').then((res)=>{
                setLoadingPage(true)
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
                title : err.response.data.error || 'Something Went Wrong!',
                icon : 'error'
            })
        }
    }

    useEffect(()=>{
        if(loadingApi){
            getAvailableDonors()
        }
    },[loadingApi,reload])

    return (
        <>     
            <AdminNavbar />
            <div className="admin_outer_div">
                <div className="admin_dashboard">
                    {
                        loadingPage ? (
                            <>
                                <Box height='100%' width='100%' display='flex' justifyContent='center' alignItems='center' >

                                    <FallingLines
                                        height={100}
                                        width={100}
                                        radius={5}
                                        color="#EAEAEA"
                                        ariaLabel="ball-triangle-loading"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                        visible={true}
                                    />
                                </Box>
                            </>
                        ) : (
                            <>
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
                                <h1>Donor List</h1>
                                <ComplexTable
                                    type='donorList'
                                    rows={donorList}
                                    sentForDonation={sentForDonation}
                                    addLoan={addLoan}
                                    sendSMS={sendSMS}
                                    sendReminder={sendReminder}
                                    deleteDonor={deleteDonor}
                                />

                                <h1>Top 10 Donors</h1>
                                <TableComp
                                    type='donor'
                                    tableColumn={tableColumn}
                                    tableContent={topDonorList}
                                />
                            </>
                        )
                    }
                    <ToastContainer />
                </div>
            </div>
        </>
    )
}

export default DonorList