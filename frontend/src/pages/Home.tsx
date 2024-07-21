import React, { useEffect, useState } from 'react';
import { request } from '../API/Requests.ts';
import config from '../config.json';                // API endpoints
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { EnsureLoggedIn, EventTask, CalendarDay } from '../styling/components.tsx';
import HomeBar from '../styling/components.tsx';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';


// https://dev.to/fitzgeraldkd/react-calendar-with-custom-styles-30c9
// https://mui.com/material-ui/react-grid/


function CustomMonthLayout() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar showDaysOutsideCurrentMonth fixedWeekNumber={6} />
    </LocalizationProvider>
  );
}




const Home: React.FC = () => {
  const [data, setData] = useState<EventTask[]>([]);

  // fetch event data when the component mounts
  useEffect(() => {
    // GET request to fetch events
    request<EventTask[]>(config.endpoint.events + '/', 'GET')
    .then((response) => {
      setData(response);              // update state with the fetched data
    });
  }, []);
  // row update event in the data grid
  const handleProcessRowUpdate = (updatedRow, originalRow) => {
    request<EventTask>(config.endpoint.events +'/', 'POST', updatedRow)
    .then((response) => {
        console.log("event saved", response)
        // refresh the eventtask data after update
        request<EventTask[]>(config.endpoint.events + '/', 'GET')
        .then((response) => {
          setData(response);
        });
    })
    .catch((error) => {
        console.log("error", error);
        // setLoading(false);
    });
    console.log(data)
    console.log(updatedRow)
  };
  
  //<MonthCalendar/>
      return (
          <div >
            <EnsureLoggedIn>
            <HomeBar>
            <div className="content">
            <h2>Yes, this calendar thing is temporary</h2>
            <CustomMonthLayout/>
            </div>
              </HomeBar>
              </EnsureLoggedIn>
          </div>
      );
  };
  export default Home;
  
  
