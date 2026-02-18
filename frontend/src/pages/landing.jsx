import React from "react";
import "../App.css";
import { Link, useNavigate } from 'react-router-dom'
export default function LandingPage() {
const router = useNavigate();

  return (
    <div className="landingPageContainer">
      <nav>
        <div className="navHeader">
          <h2>
            Connect<span style={{ color: "#fa911a" }}>Us</span>
          </h2>
        </div>

        <div className="navlist">
          <p onClick={()=>{
            router("/Utm12ConnUs")
          }}>Join as Guest</p>
          <p onClick={()=>{
            router("/auth")
          }}>Register</p>
          <div role="button">
            <p onClick={()=>{
            router("/auth")
          }}>Login</p>
          </div>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div className="textSection">
          <h1>
            <span style={{ color: "#fa911a" }}>Connect</span> with your loved Ones
          </h1>
          <p>Cover a distance by ConnectUs</p>
          <div role='button'>
            <Link to={"/auth"}>Get Started</Link>
          </div>
        </div>

        <div className="pic">
          <img src="/Mobile.png" alt="mobile" />
        </div>
      </div>
    </div>
  );
}
