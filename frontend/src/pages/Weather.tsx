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


function WeatherPage() {
    // -- render Agenda page
    return (
      <div>
        <EnsureLoggedIn>
          <HomeBar>
            <div className="content">
                
            </div>
          </HomeBar>
        </EnsureLoggedIn>
      </div>
);
};

export default WeatherPage;