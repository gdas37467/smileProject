import React from 'react'
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import GDas from '../assets/gdas.jpeg';
import SPaul from '../assets/spaul.jpeg';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import { Divider } from '@mui/material';

const DeveloperContact = () => {
    return (
        <>
            <div className="developer_outer">
                <div className="developer_inner">
                    <div className="card_outer">
                        <div className="card_inner">
                            <div className="top"></div>
                            <div className="avatar">
                                <img src={SPaul} alt="" />
                            </div>
                            <div className="about">
                                <h1>Shauvik Paul</h1>
                                <p> I enjoy learning new things and working with others. I like to find solutions to problems and make things better.</p>
                                <p>Contact No. - 7002450760</p>
                            </div>
                            <div className="social">
                                <Stack direction="row" justifyContent='center' sx={{height:'100%'}} spacing={1} divider={<Divider orientation="vertical" sx={{height:'18px', alignSelf : 'center'}}  flexItem />}>
                                    <IconButton href='mailto:paul99shauvik108@gmail.com' target='_blank'>
                                        <EmailIcon sx={{fontSize:'2.5rem' , color : '#ff4343'}} />
                                    </IconButton>
                                    <IconButton  href='https://www.linkedin.com/in/shauvik-paul20' target='_blank' >
                                        <LinkedInIcon sx={{fontSize:'2.5rem' , color : '#0a66c2'}} />
                                    </IconButton>
                                    <IconButton href='https://github.com/paulShauvik99' target='_blank' >
                                        <GitHubIcon sx={{fontSize:'2.5rem' , color : '#24292e'}} />
                                    </IconButton>
                                    <IconButton  href='https://wa.me/7002450760' target='_blank'>
                                        <WhatsAppIcon sx={{fontSize:'2.5rem' , color : '#25D366'}} />
                                    </IconButton>
                                </Stack>
                            </div>  
                        </div>
                    </div>
                    <div className="card_outer">
                        <div className="card_inner">
                            <div className="top"></div>
                            <div className="avatar">
                                <img src={GDas} alt="" />
                            </div>
                            <div className="about">
                                <h1>Gourab Das</h1>
                                <p> I'm a curious learner who enjoys teamwork and problem-solving. My goal is to contribute positively and make a difference wherever I can.</p>
                                <p>Contact No. - 7002572852</p>
                            </div>
                            <div className="social">
                                <Stack direction="row" spacing={1} justifyContent='center'  sx={{height:'100%'}}  alignSelf='center' divider={<Divider orientation="vertical" sx={{height:'18px', alignSelf : 'center'}}  flexItem />}>
                                    <IconButton href='mailto:gdas37467@gmail.com' target='_blank'>
                                        <EmailIcon sx={{fontSize:'2.5rem' , color : '#ff4343'}} />
                                    </IconButton>
                                    <IconButton  href='https://www.linkedin.com/in/gourabdas137' target='_blank' >
                                        <LinkedInIcon sx={{fontSize:'2.5rem' , color : '#0a66c2'}} />
                                    </IconButton>
                                    <IconButton href='https://github.com/gdas37467' target='_blank'>
                                        <GitHubIcon sx={{fontSize:'2.5rem' , color : '#24292e'}} />
                                    </IconButton>
                                    <IconButton  href='https://wa.me/7002572852' target='_blank'>
                                        <WhatsAppIcon sx={{fontSize:'2.5rem' , color : '#25D366'}} />
                                    </IconButton>
                                </Stack>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DeveloperContact