import React, { useEffect, useState } from 'react'
import { Button,Typography, Avatar, Card, CardContent, Paper, Divider} from '@mui/material';
import TableComp from '../Components/Table'
import CalendarComp from '../Components/Calendar';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ChakraProvider, Grid, GridItem, Skeleton, } from '@chakra-ui/react';

// Avatar Color
function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}

function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
            width : 75, 
            height : 75, 
            fontSize : 28,
            boxShadow : '0 0 2rem rgba(0,0,0,0.5)'

        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}



const DonorDashboard = () => {
    axios.defaults.withCredentials=true 

    const navigate = useNavigate()
    const [loadingPage,setLoadingPage] = useState(true)
    const [loadApi, setLoadApi] = useState(false)

    //Page Validation
    useEffect(()=>{
        if(localStorage.getItem('check') !== null){
            const now  =  new Date().getTime()
            if(JSON.parse(localStorage.getItem('check')).expire < now){
                setLoadingPage(true)
                Swal.fire({
                    title: 'Session Expired! Please Login Again!',
                    icon : 'warning'
                }).then((res)=>{
                    if(res.isConfirmed || res.dismiss === 'backdrop'){
                        localStorage.removeItem('check')
                        navigate('/donate')
                    }
                })
            }else if(!jwtDecode(JSON.parse(localStorage.getItem('check')).user).isDonor){
                setLoadingPage(true)
                Swal.fire({
                    title : 'You are not authorized to view this Page!',
                    text :  'Pleaase Register, to Continue!',
                    icon : 'warning'
                }).then((res)=>{
                    if(res.isConfirmed || res.dismiss === 'backdrop'){
                        navigate('/donate')
                    }
                })
            }else{
                setLoadApi(true)
            }
        }else{
            setLoadingPage(true)
            Swal.fire({
                title : 'You are not authorized to view this Page',
                text : 'Please Login/Register to Continue.',
                icon : 'warning'
            }).then((res)=>{
                if(res.isConfirmed || res.dismiss === 'backdrop'){
                    navigate('/donate')
                }
            })
        }
    },[])



    const [pastRecordRows, setPastRecordRows] = useState([])
    const [donorDetails, setDonorDetails] = useState()
    //Set Time
    const [time, setTime] = useState(['','',''])
    //Set Date
    const [date, setDate] = useState(['','',''])


    //Fetch Donor Records 
    const getDonorRecords = async () =>{
        setLoadingPage(true)
        try {
            const res = await axios.get('http://127.0.0.1:8000/donor/get_donor_records/')
            console.log(res)
            setPastRecordRows(res.data.pastRecord)
            setDonorDetails(res.data.donorDetails)
        } catch (error) {
            Swal.fire({
                text : error.response.data.error,
                icon : 'error'
            })
        }
        setLoadingPage(false)
    }

    //Page loading API
    useEffect(()=>{
        // Date and Time for Display
        setInterval(()=>{
            let date = new Date()
            setTime(date.toLocaleTimeString('en-US',{hour12: true, hour : '2-digit', minute : '2-digit'}).split(/[\s:]/))
            setDate(date.toLocaleDateString('en-US', {weekday : 'short', day : '2-digit', month : 'long'}).split(' '))
        },1000)


        if(loadApi){
            getDonorRecords()
        }
    },[loadApi])

    // Logout API call
    const logout = () => {
        try{
            axios.get('http://127.0.0.1:8000/donor/logout/').then((res)=>{
                setLoadingPage(true)
                localStorage.removeItem('check')
                Swal.fire({
                    title : 'Logout Successful',
                    icon : 'success',
                }).then((res) =>{
                    if(res.isConfirmed || res.dismiss === 'backdrop'){
                        navigate('/request')
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

    const tableColumn = ["Patient's Name", "Donation Date", "Phone Number", "Blood Group"]

    return (
        <>
                        <div className="don_dashboard_outer_div">
                                <div className="don_dashboard_content">
                                    <div className="actual_content">
                        {
                                !loadingPage ? (
                                    <>
                                        <div className="logout">
                                            <Button variant='contained' onClick={logout}
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
                                        <div className="grid_container">
                                            <div className="main">
                                                    <div className="upper">     
                                                        <div className="first">
                                                            <Avatar {...stringAvatar('Gourab Das')}/>
                                                            <Typography variant="h3" >
                                                                Hi there, Gourab Das.
                                                            </Typography>
                                                        </div>                                                   
                                                                <Typography variant="h5" m={0.5} >
                                                                    <b>Phone Number : </b> +91 7002450760
                                                                </Typography>
                                                                <Typography variant="h5" m={0.5} >
                                                                    <b>Address : </b> Somewhere in the City of Joy
                                                                </Typography>
                                                                <Typography variant="h5" m={0.5}>
                                                                    <b> Sex :</b> Male
                                                                </Typography>
                                                                <Typography variant="h5" m={0.5}>
                                                                    <b> Last Donated : </b> 04/12/2023
                                                                </Typography>
                                                    </div>
                                                    <Divider />
                                                    <div className="lower">
                                                                <Typography variant="h4" m={0.5} mt='1rem' sx={{padding : '0.5rem' , backgroundColor : '#f0e3e4' , borderRadius : '1rem' , fontSize : '2rem', textAlign : 'center', color : '#d71414' }} >
                                                                    You Have an Upcoming Appointment on <b> 26/01/2024 </b>
                                                                </Typography>                                                               
                                                        
                                                                <Typography variant="h5" mt={2} fontSize={24}>
                                                                    You're Eligible for Donating.
                                                                </Typography>
                                                    </div>
                                            </div>
                                            <div className="calendar">
                                                <div className="date_time">
                                                    <div className="date">
                                                        <p>{`${date[0]} ${date[2]}`}</p>   
                                                        <p>{date[1]}</p>   
                                                    </div>
                                                    <div className="time">
                                                        <p>{time[0]}</p>
                                                        <p> : </p>
                                                        <p>{time[1]}</p>
                                                        <p> {time[2].toLowerCase()} </p>                                                        
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="requests">
                                                <Typography variant="h3" >
                                                    Previous Donations
                                                </Typography>
                                                <TableComp
                                                    type='donor'
                                                    tableColumn={tableColumn}
                                                    tableContent={pastRecordRows}
                                                />
                                            </div>  
                                        </div>
                                    </>  
                                    ) : (
                                        <ChakraProvider>
                                            <Grid 
                                                templateRows='repeat(2,1fr)'
                                                templateColumns='repeat(3,1fr)'
                                                gap={4}
                                                p={5}

                                            >
                                                <GridItem
                                                    colSpan={2}
                                                >
                                                    <Skeleton
                                                        height='40rem'
                                                        startColor='red.100'
                                                        speed={1}
                                                    >

                                                    </Skeleton>
                                                    
                                                </GridItem>
                                                <GridItem
                                                    colSpan={1}
                                                    rowSpan={2}
                                                >
                                                    <Skeleton
                                                        startColor='red.100'
                                                        speed={1}

                                                        height='100%'
                                                        // width='70rem'
                                                    >

                                                    </Skeleton>

                                                </GridItem>
                                                <GridItem
                                                    colSpan={2}
                                                >

                                                    <Skeleton
                                                        startColor='red.100'
                                                        height='40rem'
                                                        speed={1}
                                                    >

                                                    </Skeleton>
                                                </GridItem>
                                            </Grid>

                                        </ChakraProvider>
                                    )   
                                }
                                    </div>
                                </div>
                        </div>
                            
        </>
    )
}

export default DonorDashboard