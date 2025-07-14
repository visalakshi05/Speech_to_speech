import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { LoadingContext } from './LoadingContext'; 
import { useContext } from 'react';
import axios from 'axios';
import "./App.css"


function Home() {
  const [play,setPlay]= useState(0);
  const [time,setTime]=useState(new Date().toLocaleTimeString([], { hour12: false }));
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoadingContext);

  const handleGoToChats = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/chats');
      setIsLoading(false);
    }, 300); // Delay to show spinner briefly
  };
    //Clock updater
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour12: false }));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pollStatus = async () => {
      try {
        const res = await axios.get("http://localhost:8000/status");
        const status = res.data.status;
        setPlay(status === "speaking" ? 1 : 0);
      } catch (err) {
        console.error("Failed to fetch status:", err);
      }
    };

    const interval = setInterval(pollStatus, 1000);
    return () => clearInterval(interval);
  }, []); 
  return (
   <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-8xl font-WDX text-white absolute mb-[15%]">{time}</h1>
      <div className={`${play === 1? 'soundwave': 'alive'} flex flex-row space-x-8`}>
        <span  className='bg-white  rounded-full'></span>
        <span  className='bg-white  rounded-full'></span>
        <span  className='bg-white  rounded-full'></span>
        <span  className='bg-white  rounded-full'></span>
        <span  className='bg-white  rounded-full'></span>
      </div>  
      <button
        className="absolute bottom-8 px-4 py-2 bg-white text-gradblue rounded-lg"
        onClick={handleGoToChats}
      >Chat</button>
    </div>
  )
}

export default Home
