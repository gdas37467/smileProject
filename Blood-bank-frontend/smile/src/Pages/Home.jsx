import React, { useEffect, useState } from 'react'
import HomePage from '../assets/NewHome.svg'
import { motion } from 'framer-motion'
import axios from 'axios'
import { Rings } from 'react-loader-spinner';
import { Box, Button, Typography } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { useNavigate } from 'react-router-dom';


const imgDiv = {
    hidden : {
        opacity : 0
    },
    show : {
        opacity : 1,
        transition : {
            delay : 0.6,
            delayChildren : 1
        }
    }
}

const sentence = {
    initial : {
        x : '-100vw'
    },
    animate : {
        x : 0,
        transition : {
            delay : 1,
            stiffness : 100
        }
    },
    animateP : {
        x : 0,
        transition : {
            delay : 1.2,
            stiffness  : 100
        }
    },
}

const styleBox = {
    box1 : {
        // display : 'flex',
        // gap : {lg : '5rem', xs: '1rem'},
        alignSelf : 'flex-end',
        padding: {lg : '0 10rem 0 15rem', xs: '0 2.1rem'},
    },
    box2 : {
        margin : '4rem 1rem',
        backgroundColor : '#EAEAEA',
        padding : '2rem 3rem',
        display : 'flex',
        flexDirection : 'column',
        alignItems : 'center',
        gap : {lg : '2rem', xs : '1rem'},
        boxShadow: '0 0 50px rgba(0,0,0,0.5)',

    }
    
}


const Home = () => {
    axios.defaults.withCredentials = true; 
    
    const navigate = useNavigate();
    const [images,setImages] = useState({})
    const [loadPage,setLoadPage] = useState(true)

    const loadImgs = async() =>{
        setLoadPage(true)
        try{
            const res = await axios.get('http://192.168.29.55:8000/api/v1/adminUser/getLeaderboardImages/')
            setImages(res.data.data)
        }catch(e){
            console.log('Something went wrong')
        }
        setLoadPage(false)
    }
    
    
    useEffect(()=>{
        loadImgs();
    },[])

    
    return (
        <>
            <div className="home_outer">

                {
                    loadPage ? ( 
                        <>
                            <Rings
                                visible={true}
                                height={100}
                                width={100}
                                color="#C0463B"
                                wrapperStyle={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 'calc(100vh - 20rem)',
                                    background: '#eaeaea',
                                }}
                            />
                        </>
                    ) : ( 
                        <> 
                            {/* ----------- Landing Section ------------- */}
                            <div className="landing">
                                <div  className="left">
                                    <motion.h5 variants={sentence} initial='initial' animate='animate'>
                                        Give the Gift of Life by Donating Blood
                                    </motion.h5>

                                    <motion.p variants={sentence} initial='initial' animate='animateP'>
                                        Join our incredible community of over <b>2,000</b> active donors who are making a difference every day. Your donation can save lives—become a hero today!
                                    </motion.p>
                                    <Box sx={styleBox.box1}>
                                        {/* <Button variant='contained' startIcon={<PersonAddIcon sx={{height : {xs : '1rem', lg : '1.8rem'}}} />}
                                            sx={{
                                                    backgroundColor : '#d71414',
                                                    borderRadius : '1rem',
                                                    color : '#f0e3e4',
                                                    fontWeight : 'bold',
                                                    fontSize : {lg : '1rem', xs : '0.6rem'},
                                                    "&:hover" : {
                                                        backgroundColor : '#d71414',
                                                        color : '#f0e3e4',
                                                    },
                                                    height : { lg : '4rem',xs : '1.5rem'}
                                                }}
                                                onClick={() => navigate('/request')}
                                        >
                                            Register Now
                                        </Button> */}
                                        <Button variant='contained' endIcon={<VolunteerActivismIcon sx={{height : {xs : '1rem', lg : '1.8rem'} , width : 'auto' }} />}
                                            sx={{
                                                    backgroundColor : '#d71414',
                                                    borderRadius : {lg : '1rem', xs : '0.5rem'},
                                                    color : '#f0e3e4',
                                                    fontWeight : 'bold',
                                                    fontSize : {lg : '1rem', xs : '0.6rem'},
                                                    "&:hover" : {
                                                        backgroundColor : '#d71414',
                                                        color : '#f0e3e4',
                                                    },
                                                    height : { lg : '4rem',xs : '1.5rem'},

                                                }}
                                                onClick={() => navigate('/donate')}
                                        >
                                            Join Us Today
                                        </Button>
                                    </Box>
                                    
                                </div>
                                <img src={HomePage} alt="HomePage" />
                            </div>

                            <Box sx={styleBox.box2}>
                                        <Typography variant='h4' sx={{display : 'flex', alignItems : 'center', fontSize : {lg : '1.9rem' , xs : '0.9rem'} , color : '#191818'}} >
                                            If you need blood or know someone who does, don't hesitate to contact us. We're here to offer assistance and support.
                                        </Typography>
                                        <Button variant='contained' startIcon={<WaterDropIcon sx={{height : {xs : '1rem', lg : '1.8rem'}, width : 'auto'  }} />}
                                            sx={{
                                                    backgroundColor : '#d71414',
                                                    borderRadius : {lg : '1rem', xs : '0.5rem'},
                                                    color : '#f0e3e4',
                                                    fontWeight : 'bold',
                                                    fontSize : {lg : '1rem', xs : '0.6rem'},
                                                    "&:hover" : {
                                                        backgroundColor : '#d71414',
                                                        color : '#f0e3e4',
                                                    },
                                                    height : { lg : '4rem',xs : '1.5rem'},
                                                    width : '15rem'

                                                }}
                                                onClick={() => navigate('/request')}
                                        >
                                            Request Blood
                                        </Button> 
                            </Box>


                            {/* ------------ About Section ------------- */}
                            <div className="about">
                                <div className="about_content">
                                    <motion.div variants={imgDiv} initial='hidden' animate='show'  className="photo_gallery">
                                        <div className="imgs">
                                            <img src={images.image1} alt="Img2" />
                                        </div>
                                        <div className="imgs">
                                            <img src={images.image5} alt="Img2" />
                                        </div>
                                        <div className="imgs">
                                            <img src={images.image4} alt="Img2" />
                                        </div>
                                        <div className="imgs">
                                            <img src={images.image3} alt="Img2" />
                                        </div>
                                        <div className="imgs">
                                            <img src={images.image2} alt="Img2" />
                                        </div>
                                    </motion.div>  
                                    <div className="about_smile">
                                        <motion.div className="container"
                                            variants={imgDiv}
                                            initial='hidden'
                                            whileInView='show'
                                            viewport={{
                                                    once: true
                                                }}  
                                        >
                                            <motion.h5
                                                initial={{
                                                    x : -100
                                                }}
                                                whileInView={{
                                                    x : 0
                                                }}
                                                transition={{
                                                    delay: 1
                                                }}
                                                viewport={{
                                                    once: true
                                                }}
                                            >
                                                About Smile
                                            </motion.h5>

                                            <motion.p
                                                initial={{
                                                    x : '-100%'
                                                }}
                                                whileInView={{
                                                    x : 0
                                                }}
                                                transition={{
                                                    delay : 1.2,
                                                    stiffness : 100
                                                }}
                                                viewport={{
                                                    once: true
                                                }}
                                            >
                                                Welcome to Smile, a dedicated Non-Profit Organization committed to providing life-saving blood to those in need. Our mission goes beyond just blood donation; we strive to foster a sense of community and togetherness through various cultural activities and events.
                                                <br />
                                                <br />
                                                With a robust donor base of over 2,000 active donors, we are able to respond swiftly and efficiently to urgent blood requests. Our dedicated team works tirelessly to ensure that no patient is left waiting for the blood they desperately need.
                                                <br />
                                                <br />
                                                At Smile, we believe in the power of unity and compassion. Our cultural activities are designed to bring people together, creating a strong support network and raising awareness about the importance of blood donation.
                                                
                                            </motion.p>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }

            </div>
        </>

    )
}

export default Home