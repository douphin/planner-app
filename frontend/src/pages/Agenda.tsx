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
import { EventsList, FullFeaturedCrudGrid } from '../styling/tasksComponents.tsx';




function AgendaPage() {
    // -- render Agenda page
    return (
      <div>
        <EnsureLoggedIn>
          <HomeBar>
            <div className="content">
                {/* <EventsList /> */}
                <FullFeaturedCrudGrid />

                { /* weather stuff */ }
                <Box sx={{ 
                    display: 'flex',  
                    justifyContent: 'flex-end', 
                    width: '99%', 
                  }}>
                    <Box sx={{ 
                      width: '30%',   
                      padding: 5, 
                      maxHeight: 10, 
                      boxSizing: 'border-box', 
                    }}>
                        {[12].map((elevation) => (
                          <Item key={elevation} elevation={elevation}>
                            {`Weather stuff`}
                          </Item>
                        ))}
                    </Box>
                </Box>
            </div>
          </HomeBar>
        </EnsureLoggedIn>
      </div>
);
};

export default AgendaPage;
    
    
