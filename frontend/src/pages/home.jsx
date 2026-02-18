import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css"
import { Button, IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore'

import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {

    const navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");


    const {addToUserHistory} = useContext(AuthContext);

    const handleJoinVideoCall = async() => {
        if (!meetingCode.trim()) {
            alert("Please enter meeting code");
            return;
        }
        await addToUserHistory(meetingCode)
        navigate(`/${meetingCode}`);
    };

    return (
        <>
            <div className="navBar">
                <div style={{display:"flex", alignItems:"center"}}>
                    <h2>Connect<span style={{ color: "#fa911a" }}>Us</span></h2>
                </div>

                <div style={{display:"flex", alignItems:"center"}}>
                    <IconButton onClick={()=>{
                        navigate("/history")
                    }}>
                        <RestoreIcon />
                    </IconButton>
                    <p>History</p>

                    <Button 
                        style={{marginLeft:"10px"}} 
                        variant="contained"
                        onClick={()=>{
                            localStorage.removeItem("token");
                            navigate("/auth");
                        }}
                    >
                        LogOut
                    </Button>
                </div>
            </div>

            <div className="meetContainer">
                <div className="leftPanel">
                    <h2>Providing Quality Video Call Just Like Quality Education</h2> 

                    <div style={{ display:"flex",gap:"10px",marginTop:"40px"}}>
                        <TextField
                            label="Meeting Code"
                            variant="outlined"
                            onChange={e => setMeetingCode(e.target.value)}
                        />
                        <Button 
                            variant='contained'
                            onClick={handleJoinVideoCall}
                        >
                            Join
                        </Button>
                    </div>
                </div>

                <div className="rightPanel">
                    <img src="/logo3.png" alt="logo" />
                </div>
            </div>
        </>
    );
}

export default withAuth(HomeComponent)
