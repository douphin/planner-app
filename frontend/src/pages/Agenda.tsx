import React, { useEffect, useState } from 'react';
import { request } from '../API/Requests.ts';
import { postEvent } from '../API/userAPI.ts';
import config from '../config.json';                // API endpoints
import { Box, TextField, Button } from '@mui/material';                // UI component for layout
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { EnsureLoggedIn, EventTask } from '../styling/components.tsx';
import HomeBar from '../styling/components.tsx';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import AddBoxIcon from '@mui/icons-material/AddBox';



// TODO: change so that only user_id events will show (foreign keys and routes)
// 

// ------ edit event

const handleAddEvent = async (event: EventTask) => {
  let user_id = event.user_id
  let name = event.name
  let description = event.description
  let start_time = event.start_time
  let end_time = event.end_time
  let status = event.status
  try {
    postEvent({ id: -1, user_id: 1, name, description, start_time, end_time, status })    
      .then((eventAdded)=>{
        if(eventAdded)
          alert(`Updated event ${event.name}!`)
        else 
          alert("Failed to add event. Please try again.")
    });
  } catch (error) {
    console.error("Error adding event:", error);
    alert("Failed to add event. Please try again."); 
  }
};



//const Home: React.FC = () => {
  function AgendaPage() {
    const [data, setData] = useState<EventTask[]>([]);
    const [showNewRow, setShowNewRow] = useState(false);


  
    // fetch event data when the component mounts
    useEffect(() => {
      // GET request to fetch events
      request<EventTask[]>(config.endpoint.events + '/', 'GET')
      .then((response) => {
        setData(response);              // update state with the fetched data
      });
    }, []);

    const new_event: EventTask = { 
      id: -1,     // or some temporary value
      user_id: 1,   // fix to actually get id
      name: '', 
      description: '', 
      start_time: '', 
      end_time: '', 
      status: '' 
    };

    /*
    // ----- columns to display events
    const columns: GridColDef<EventTask>[] = [
      { field: 'name', headerName: 'Name', width: 150, editable:true },
      { field: 'start_time', headerName: 'start', width: 150, editable:true },
      { field: 'end_time', headerName: 'end', width: 150, editable:true },
      { field: 'description', headerName: 'Description', width: 150, editable:true },
      { field: 'status', headerName: 'Status', width: 150, editable:true },
      // edit event button
      { field: 'actions',
        type: 'actions',
        width: 150,
        getActions: (params: GridRowParams<EventTask>) => [
          <Button
          variant="text"
          startIcon={<EditCalendarIcon />}
          onClick={() => {
            if (params.row.id === -1) { // Check if it's a new event row
              handleAddEvent(params.row);
            } else {
              handleEditEvent(params.row);
            }
          }}
        >
          {params.row.id === -1 ? 'Add Event' : 'Update'}  
        </Button>
        ]
      },
    ];
*/
    
    const showAddEvent = () => {
      setShowNewRow(true);
    };




    const handleSaveEvent = async (params: GridRowParams<EventTask>) => {
      const { row } = params;
      try {
        if (row.id === -1) {
          // add new event
          const newEvent = await request<EventTask>(config.endpoint.events, "POST", row);
          setData((prevData) => [...prevData, newEvent]);
        } else {
          // update existing event
          const updatedEvent = await request<EventTask>(`${config.endpoint.events}/${row.id}`, "PUT", row);
          setData((prevData) =>
            prevData.map((event) => (event.id === row.id ? updatedEvent : event))
          );
        }
      } catch (error) {
        console.error("Error saving event:", error);
      }
    };
    
    /*
    const [name, setName] = useState('');
    const [start_time, setStart] = useState('');
    const [end_time, setEnd] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
*/
    const event_columns: GridColDef<EventTask>[] = [
      {
        field: "name",
        headerName: "Name",
        width: 150,
        editable: true,
        renderEditCell: (params) => (
          <TextField
            value={params.value}
            onChange={(e) =>
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: e.target.value,
              })
            }
            autoFocus
          />
        ),
      },
      {
        field: "start_time",
        headerName: "Start",
        width: 150,
        editable: true,
        renderEditCell: (params) => (
          <TextField
            value={params.value}
            onChange={(e) =>
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: e.target.value,
              })
            }
            type="datetime-local"
            autoFocus
          />
        ),
      },
      {
        field: "end_time",
        headerName: "End",
        width: 150,
        editable: true,
        renderEditCell: (params) => (
          <TextField
            value={params.value}
            onChange={(e) =>
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: e.target.value,
              })
            }
            type="datetime-local"
            autoFocus
          />
        ),
      },
      {
        field: "description",
        headerName: "Description",
        width: 150,
        editable: true,
        renderEditCell: (params) => (
          <TextField
            value={params.value}
            onChange={(e) =>
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: e.target.value,
              })
            }
            autoFocus
            multiline
            maxRows={4} // allow for multiline input
          />
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 150,
        editable: true,
        renderEditCell: (params) => (
          <TextField
            value={params.value}
            onChange={(e) =>
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: e.target.value,
              })
            }
            autoFocus
          />
        ),
      },
      // add event button
      {
        field: "actions",
        type: "actions",
        width: 150,
        getActions: (params: GridRowParams<EventTask>) => [
          <Button
            variant="text"
            startIcon={<EditCalendarIcon />}
            onClick={() => handleSaveEvent(params)}
            sx={{
              color: "black", 
              "&:active": {       // clicked
                backgroundColor: "black",
              }
            }}
          >
            {params.row.id === -1 ? "Add Event" : "Update"}
          </Button>,
        ],
      },
    ];
    



    const handleProcessRowUpdate = (updatedRow, originalRow) => {
      request<EventTask>(config.endpoint.events +'/', 'POST', updatedRow)
      .then(async (savedEvent: EventTask) => { // Type the response as EventTask
          console.log("event saved", savedEvent);
  
          // refresh the event data after update
          try {
              const refreshedEvents = await request<EventTask[]>(config.endpoint.events + '/', 'GET');
              setData(refreshedEvents); // update state with the fetched data
          } catch (error) {
              console.error("Error refreshing events:", error);
          }
      })
      .catch((error) => {
          console.log("error", error);
      });
      console.log(data)
      console.log(updatedRow)
  };


      
      return (
          <div >
            <EnsureLoggedIn>
              <HomeBar>
                <div className="content">
                  <Button variant="outlined" 
                    startIcon={<AddBoxIcon/>} 
                    onClick={showAddEvent}
                    sx={{
                      color: "black", 
                      "&:active": {       // clicked
                        backgroundColor: "black",
                      }
                    }}>
                    Add Event
                  </Button>                
                  <Box sx={{ padding: 5, maxHeight: 10 }}>
                  <DataGrid
                        rows={showNewRow ? [...data, new_event] : data}
                        columns={event_columns}
                        autoHeight
                        initialState={{
                        pagination: {
                            paginationModel: {
                            pageSize: 10,
                            },
                        },
                        }}
                        pageSizeOptions={[5]}
                        editMode="row"
                        processRowUpdate={handleProcessRowUpdate}
                        checkboxSelection
                        disableRowSelectionOnClick
                    />
                  </Box>
                </div>
              </HomeBar>
            </EnsureLoggedIn>
          </div>
        );
      };
  export default AgendaPage;
    
    
