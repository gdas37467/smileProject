import React, { useState } from 'react'
import { NavLink, useNavigate} from 'react-router-dom'
import Smile from '../assets/SmileLogo.png'
import { Box, Drawer, IconButton, List, ListItem, ListItemButton, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';




const drawerWidth = 240;

export default function Navbar (){
    
    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = useState(false);

    // For Mobile Drawers
    const handleDrawerToggle = () => { setMobileOpen((prevState) => !prevState); };
    const container = window !== undefined ? () => window.document.body : undefined;
    
    // Send to Home page
    const goTo = () => {
        navigate('/')
    }
    
    // Mobile Navigation Drawer
    const MobNav = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' , fontSize : {xs : '2rem'}, mt : 8 , }}>
            
            <List>            
                <ListItem >
                    <ListItemButton sx={{ textAlign: 'center' }}>
                        <NavLink className="nav-link " to="/"> Home </NavLink> 
                    </ListItemButton>
                </ListItem>
                <ListItem >
                    <ListItemButton sx={{ textAlign: 'center' }}>
                        <NavLink className="nav-link " to='/request'> Request Blood </NavLink> 
                    </ListItemButton>
                </ListItem>
                <ListItem >
                    <ListItemButton sx={{ textAlign: 'center' }}>
                        <NavLink className="nav-link " to="/donate"> Donate Blood </NavLink> 
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );


    
    return (
        <>
            <div className="outer_nav">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ display: { md: 'none' } , ml : 0.1 }}
                    >
                        <MenuIcon fontSize='large'/>
                    </IconButton>
                </Toolbar>
                <div className="logo">
                    <img src={Smile} alt="Logo" onClick={goTo} />
                </div>

                <nav className="menu" >
                    <NavLink className="nav-link " to="/"> Home </NavLink>  
                    <NavLink className="nav-link " to='/request'> Request Blood </NavLink> 
                    <NavLink className="nav-link " to="/donate"> Donate Blood </NavLink> 
                </nav>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    >
                    {MobNav}
                </Drawer>    
            </div>
        </>
    )
}