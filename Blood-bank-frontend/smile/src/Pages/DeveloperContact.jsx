import React from 'react'
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Home1 from '../assets/Home1.jpeg'
import DeleteIcon from '@mui/icons-material/Delete';

const DeveloperContact = () => {
    return (
        <>
            <div className="developer_outer">
                <div className="developer_inner">
                    <div className="card_outer">
                        <div className="card_inner">
                            <div className="top"></div>
                            <div className="avatar">
                                <img src={Home1} alt="" />
                            </div>
                            <div className="about">
                                <h1>Shauvik Paul</h1>
                                <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem vel labore, accusamus pariatur repellat, excepturi hic est atque corporis, inventore vitae repellendus iusto accusantium nihil!</p>
                            </div>
                            <div className="social">
                                <Stack direction="row" spacing={1}>
                                    <IconButton aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton aria-label="delete"  color="primary">
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton aria-label="delete"  color="primary">
                                        <DeleteIcon />
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