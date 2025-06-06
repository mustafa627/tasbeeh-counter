import { useEffect, useState } from "react";
import image from "./download.png";
import img from "./images.jpg";
import "./App.css";
import axios from "axios";
function App() {
  const [count, setCount] = useState(0);
const [currentNamaz, setCurrentNamaz] = useState("Loading...");

 
useEffect(() => {
  handleTime();
  const interval = setInterval(handleTime, 60000);
  return () => clearInterval(interval);
}, []);
 

  const handleTime = async () => {
    try {
      const latitude = 24.8607;
      const longitude = 67.0011;
      const method = 2;

      const response = await axios.get(`https://api.aladhan.com/v1/timings`, {
        params: {
          latitude,
          longitude,
          method
        }
      });

      const timings = response.data.data.timings;
      const currentTime = new Date();
      const currentMinutes =
        currentTime.getHours() * 60 + currentTime.getMinutes();

      const namazNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
      const namazTimes = namazNames.map((name) => {
        const [hours, minutes] = timings[name].split(":").map(Number);
        return { name, time: hours * 60 + minutes };
      });

      let detectedNamaz = "None";
      for (let i = 0; i < namazTimes.length; i++) {
        const thisNamaz = namazTimes[i];
        const nextNamaz = namazTimes[i + 1] || { time: 24 * 60 };

        if (
          currentMinutes >= thisNamaz.time &&
          currentMinutes < nextNamaz.time
        ) {
          detectedNamaz = thisNamaz.name;
          break;
        }
      }

      setCurrentNamaz(detectedNamaz);  
    } catch (err) {
      console.error("Error fetching time:", err);
    }
  };



  return (
    <>
      <div className="App">
        <div className="header">
          <img src={image} alt="" width="50px" />
          <h1>Counter App</h1>
          <img src={img} alt="" width="50px" />
        </div>
        
        <div className="time">      
          <h5 style={{
            color: "white"
          }}>Current Time: {new Date().toLocaleTimeString()}</h5> 
          <h5 style={{
            color: "white"
          }}>Date : {new Date().toLocaleDateString()}</h5>
<h3 style={{ color: "white" }}>Current Namaz 🕌	: {currentNamaz}</h3>
        </div>

        <div className="counter">
          <button
            className="btn1"
            onClick={() => setCount((count) => count + 1)}
          >
            <h3>count is {count} 📿</h3>	
          </button>
          <br />
          <button className="btn2" onClick={() => setCount(0)}>Reset</button>
        </div>
      </div>
    </>
  );
}

export default App;
