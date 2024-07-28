import React, { useEffect, useState } from 'react';
import { request } from '../API/Requests.ts';
import { postEvent, putEvent, getUserId, deleteEvent } from '../API/userAPI.ts';
import config from '../config.json';                // API endpoints
import { Box, TextField, Button } from '@mui/material';                // UI component for layout
import { DataGrid, GridColDef, GridRowParams, GridRenderCellParams } from '@mui/x-data-grid';
import { EnsureLoggedIn, sendMessage, eventItem, Item } from '../styling/components.tsx';
import HomeBar from '../styling/components.tsx';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import AddBoxIcon from '@mui/icons-material/AddBox';
import moment from 'moment';



function FullWeatherData() {
    const [weatherData, setweatherData] = useState(""); 
  
    sessionStorage.setItem('weatherJSON', "");
  
    useEffect(() => {
      request(config.endpoint.weather +'/', 'GET')
        .then((response) => {
          try {
              sessionStorage.setItem('weatherJSON', JSON.stringify(response));
          }
          catch (error) {
            sendMessage('error', `error fetching weather data`)
          }
  
          let weatherJSON = JSON.parse(sessionStorage.getItem('weatherJSON')?.toString() + "");
          console.log(weatherJSON.timelines);
          let htmlString;
  
          for (let i = 0; i < 6; i++) {
            htmlString += `<div style="left: ${5 + i*15}%; right: ${80 - i*15}%; width: auto; top: 15%; position: absolute; border: 1px solid black;">`
            
            let xdate = Date.parse((weatherJSON.timelines.daily[i].time));
            let Wdate = moment(xdate).format('dddd, MMMM Do');

            let temperatureAvg = Math.round(32 + (9 / 5) * weatherJSON.timelines.daily[i].values.temperatureApparentAvg);
            let tempHigh = Math.round(32 + (9 / 5) * weatherJSON.timelines.daily[i].values.temperatureApparentMax);
            let tempLow = Math.round(32 + (9 / 5) * weatherJSON.timelines.daily[i].values.temperatureApparentMin);

            let humidityAvg = weatherJSON.timelines.daily[i].values.humidityAvg;
            let humidityHi = weatherJSON.timelines.daily[i].values.humidityMax;
            let humidityLo = weatherJSON.timelines.daily[i].values.humidityMin;

            let chanceofRain = weatherJSON.timelines.daily[i].values.precipitationProbabilityAvg;
            let chanceofRainHi = weatherJSON.timelines.daily[i].values.precipitationProbabilityMax;
            let chanceofRainLo = weatherJSON.timelines.daily[i].values.precipitationProbabilityMin;

            let cloudCover = weatherJSON.timelines.daily[i].values.cloudCoverAvg;
            let cloudCoverHi = weatherJSON.timelines.daily[i].values.cloudCoverMax;
            let cloudCoverLo = weatherJSON.timelines.daily[i].values.cloudCoverMin;

            let uvIndex = weatherJSON.timelines.daily[i].values.uvIndexAvg;
            let uvIndexHi = weatherJSON.timelines.daily[i].values.uvIndexMax;
            let uvIndexLo = weatherJSON.timelines.daily[i].values.uvIndexMin;

            xdate = Date.parse((weatherJSON.timelines.daily[i].values.sunriseTime));
            let sunriseTime = moment(xdate).format('LT');
            xdate = Date.parse((weatherJSON.timelines.daily[i].values.sunsetTime));
            let sunsetTime = moment(xdate).format('LT');


            htmlString += "<ul>" + Wdate;
            htmlString +="<br><br><li> Average Temp: " + temperatureAvg + "&deg F" + "</li>";
            htmlString += " High | Low : " + tempHigh + "&deg F | " + tempLow + "&deg F <br>";
            htmlString += "<br><li> Humidity: " + humidityAvg + "% </li>";
            htmlString += " High | Low : " + humidityHi + "% | " + humidityLo + "% <br>";
            htmlString += "<br><li> Chance of Rain: " + chanceofRain + "% </li>";
            htmlString += " High | Low : " + chanceofRainHi + "% | " + chanceofRainLo + "% <br>";
            htmlString += "<br><li> Cloud Cover: " + cloudCover + "% </li>";
            htmlString += " High | Low : " + cloudCoverHi + "% | " + cloudCoverLo + "% <br>";
            htmlString += "<br><li> UV Index: " + uvIndex + " </li>";
            htmlString += " High | Low : " + uvIndexHi + " | " + uvIndexLo + " <br>";
            htmlString += "<br><li> Sun rise/set Time: <br>" + sunriseTime + " | " + sunsetTime + " </li>";
            htmlString += "</ul></div>"
          }
          setweatherData(htmlString);
        });
    }, []);
    return (<div className='content' style={{display: 'flex'} }dangerouslySetInnerHTML={{__html: weatherData.substring(9)}}></div>);
  };



function WeatherPage() {
    // -- render Weather page
    return (
      <div>
        <EnsureLoggedIn>
          <HomeBar>
            <div className="content" style={{display: 'block'}}>
                {/*
                <div  style={{left: '5%', right: '80%', width: 'auto', top: '15%', position: 'absolute'}}>here</div>
                <div  style={{left: '24%', right: '66%', width: 'auto', top: '15%', position: 'absolute'}}>here</div>
                <div  style={{left: '38%', right: '52%', width: 'auto', top: '15%', position: 'absolute'}}>here</div>
                <div  style={{left: '52%', right: '38%', width: 'auto', top: '15%', position: 'absolute'}}>here</div>
                <div  style={{left: '66%', right: '24%', width: 'auto', top: '15%', position: 'absolute'}}>here</div>
                <div  style={{left: '80%', right: '5%', width: 'auto', top: '15%', position: 'absolute'}}>here</div>
                */}
            <FullWeatherData/>
            </div>
          </HomeBar>
        </EnsureLoggedIn>
      </div>
);
};

export default WeatherPage;