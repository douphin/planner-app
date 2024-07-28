import React, { useEffect, useState } from 'react';
import { request } from '../API/Requests.ts';
import { getUserId } from '../API/userAPI.ts';
import config from '../config.json';                // API endpoints
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { EnsureLoggedIn, CalendarDay, eventItem, sendMessage } from '../styling/components.tsx';
import HomeBar from '../styling/components.tsx';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';


function CustomMonthLayout() {
  console.log(new Date().getMonth.toString());
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar showDaysOutsideCurrentMonth fixedWeekNumber={6} />
    </LocalizationProvider>
  );
}








const Home: React.FC = () => {
  const [data, setData] = useState<eventItem[]>([]);

    // -- get user id
    let userId = getUserId();
    //sendMessage('error', `/fetchEvents/${userId}`);

    // -- fetch event data when the component mounts
    useEffect(() => {
        request<eventItem[]>(config.endpoint.events + `/fetchEvents/${userId}`, 'GET')
        .then((response) => {
            setData(response);    // update state with the fetched data
        })
        .catch((error) => {
            sendMessage('error', `error fetching event data`)
        });
    }, []);
    
    return (
        <div >
          <EnsureLoggedIn>
            <HomeBar>
              <div className="content">
  
                <CustomMonthLayout/>
              </div>
            </HomeBar>
          </EnsureLoggedIn>
        </div>
    );
};
export default Home;
  
  
