import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext(null);

const client = axios.create({
  baseURL: "http://localhost:8000/api/v1/users"
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // REGISTER
  const handleRegister = async (name, username, password) => {
    try {
      const response = await client.post("/register", {
        name,
        username,
        password,
      });

      if (response.status === 201) {
        return response.data.message;
      }
    } catch (error) {
      // 👇 forward backend error to component
      throw error;
    }
  };

  // LOGIN
  const handleLogin = async (username, password) => {
    try {
      const response = await client.post("/login", {
        username,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        setUserData({ username });
        navigate('/home');
      }
    } catch (error) {
      throw error;
    }
  };

  const getHistoryOfUser = async()=>{
    try{
      let request = await client.get("/get_all_activity",{
        params:{
          token: localStorage.getItem("token")
        }
      });
      return request.data
    }catch(err){
      throw err;
    }
  }

  const addToUserHistory = async(meetingCode)=>{
    try{
      let request = await client.post("/add_to_activity",{
        token: localStorage.getItem("token"),
        meeting_code:meetingCode
      });
      return request
    }catch(err){
       throw err
    }
  }

  const value = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
    getHistoryOfUser,
    addToUserHistory,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
