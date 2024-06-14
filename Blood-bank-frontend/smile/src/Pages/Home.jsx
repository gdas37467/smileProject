import React, { useEffect, useState } from 'react'
import HomePage from '../assets/NewHome.svg'
import { motion } from 'framer-motion'
import axios from 'axios'
import { Rings } from 'react-loader-spinner';
import { Box, Button } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
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
    display : 'flex',
    gap : {lg : '5rem', xs: '1rem'},
    alignSelf : 'center',
    
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
            console.log(e.data.status)
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
                                        Donate Your Blood to Us, Save More Life Together
                                    </motion.h5>

                                    <motion.p variants={sentence} initial='initial' animate='animateP'>
                                        Join us in our mission to save lives and build a healthier, more connected community. Together, we can make a difference.
                                    </motion.p>
                                    <Box sx={styleBox}>
                                        <Button variant='contained' startIcon={<PersonAddIcon sx={{height : {xs : '1rem', lg : '1.8rem'}}} />}
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
                                        </Button>
                                        <Button variant='contained' endIcon={<VolunteerActivismIcon sx={{height : {xs : '1rem', lg : '1.8rem'}}} />}
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
                                                onClick={() => navigate('/donate')}
                                        >
                                            Join Us
                                        </Button>
                                    </Box>
                                    
                                </div>
                                <img src={HomePage} alt="HomePage" />
                            </div>
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