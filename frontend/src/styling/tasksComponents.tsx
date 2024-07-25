import React, { useEffect, useState } from 'react';
import { request } from '../API/Requests.ts';
import { postEvent, putEvent, getUserId, deleteEvent } from '../API/userAPI.ts';
import config from '../config.json';                // API endpoints
import { Box, TextField, Button } from '@mui/material';                // UI component for layout
import { EnsureLoggedIn, sendMessage, eventItem, Item } from '../styling/components.tsx';
import HomeBar from '../styling/components.tsx';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef, 
  GridRowParams,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridSlots,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';


const statuses = ['to do', 'in progress', 'complete', 'on hold'];
const randomStatus = () => {
	return randomArrayItem(statuses);
};

const initialRows: GridRowsProp = [
	{
	  id: randomId(),
	  name: 'task 1',
	  description: 'description 1',
	  start_time: randomCreatedDate(),
	  end_time: randomCreatedDate(),
	  status: randomStatus(),
	},
	{
	  id: randomId(),
	  name: 'task 2',
	  description: 'description 2',
	  start_time: randomCreatedDate(),
	  end_time: randomCreatedDate(),
	  status: randomStatus(),
	},
];



interface EditToolbarProps {
	setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
	setRowModesModel: (
	  newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
	) => void;
}


function EditToolbar(props: EditToolbarProps) {
	const { setRows, setRowModesModel } = props;

	const handleClick = () => {
		const id = randomId();			// TODO: fix ****
		setRows((oldRows) => [...oldRows, { id, name: '', description: '', isNew: true }]);
		setRowModesModel((oldModel) => ({
		...oldModel,
		[id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
		}));
	};

	return (
		<GridToolbarContainer>
			<Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
				Add Task
			</Button>
		</GridToolbarContainer>
	);
}






export function FullFeaturedCrudGrid() {
	const [rows, setRows] = React.useState(initialRows);
	const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

	// ----
	const [data, setData] = useState<eventItem[]>([]);

	// -- get user id
	let userId = getUserId();	//window.sessionStorage.getItem('id');


    // -- fetch event data when the component mounts
    useEffect(() => {
        request<eventItem[]>(config.endpoint.events + `/fetchEvents/${userId}`, 'GET')
        .then((response) => {
            setData(response);    // update state with the fetched data
        });
    }, []);

		/*
    // -- update rows in data grid
    const handleProcessRowUpdate = (updatedRow, originalRow) => {
		request<eventItem>(config.endpoint.events +'/', 'POST', updatedRow)
		.then(async (savedEvent: eventItem) => {        // type the response as Event
			console.log("event saved", savedEvent);
		  
			// refresh the event data after update
			try {
				const refreshedEvents = await request<eventItem[]>(config.endpoint.events + `/fetchEvents/${userId}`, 'GET');
				setData(refreshedEvents);   // update state with fetched data
			} catch (error) {
				console.error("Error refreshing events: ", error);
			}
		})
		.catch((error) => {
			console.log("error", error);
		});
		console.log(data)
		console.log(updatedRow)
	};
	*/

  
	const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
	  if (params.reason === GridRowEditStopReasons.rowFocusOut) {
		event.defaultMuiPrevented = true;
	  }
	};
  
	const handleEditClick = (id: GridRowId) => () => {
	  setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
	};
  
	const handleSaveClick = (id: GridRowId) => () => {
	  setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
	};
  
	const handleDeleteClick = (id: GridRowId) => () => {
	  setRows(rows.filter((row) => row.id !== id));
	};
  
	const handleCancelClick = (id: GridRowId) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true },
		});
  
		const editedRow = rows.find((row) => row.id === id);
		if (editedRow!.isNew) {
			setRows(rows.filter((row) => row.id !== id));
		}
	};
  
	const processRowUpdate = (newRow: GridRowModel) => {
		const updatedRow = { ...newRow, isNew: false };
		setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
		return updatedRow;
	};
  
	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};
  
	const columns: GridColDef[] = [
	  { field: 'name', headerName: 'Name', width: 180, editable: true },
	  {
		field: 'description',
		headerName: 'Description',
		width: 180,
		align: 'left',
		headerAlign: 'left',
		editable: true,
	  },
	  {
		field: 'start_time',
		headerName: 'Start',
		type: 'date',
		width: 100,
		editable: true,
	  },
	  {
		field: 'end_time',
		headerName: 'End',
		type: 'date',
		width: 100,
		editable: true,
	  },
	  {
		field: 'status',
		headerName: 'Status',
		width: 150,
		editable: true,
		type: 'singleSelect',
		valueOptions: ['complete', 'on hold', 'to do', 'in progress'],
	  },
	  {
		field: 'actions',
		type: 'actions',
		headerName: 'Actions',
		width: 100,
		cellClassName: 'actions',
		getActions: ({ id }) => {
		  const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
  
		  if (isInEditMode) {
			return [
			  <GridActionsCellItem
				icon={<SaveIcon />}
				label="Save"
				sx={{
				  color: 'primary.main',
				}}
				onClick={handleSaveClick(id)}
			  />,
			  <GridActionsCellItem
				icon={<CancelIcon />}
				label="Cancel"
				className="textPrimary"
				onClick={handleCancelClick(id)}
				color="inherit"
			  />,
			];
		  }
  
		  return [
			<GridActionsCellItem
			  icon={<EditIcon />}
			  label="Edit"
			  className="textPrimary"
			  onClick={handleEditClick(id)}
			  color="inherit"
			/>,
			<GridActionsCellItem
			  icon={<DeleteIcon />}
			  label="Delete"
			  onClick={handleDeleteClick(id)}
			  color="inherit"
			/>,
		  ];
		},
	  },
	];
  
	return (
	  <Box
		sx={{
		  height: 500,
		  width: '70%',
		  '& .actions': {
			color: 'text.secondary',
		  },
		  '& .textPrimary': {
			color: 'text.primary',
		  },
		}}
	  >
		<DataGrid
		  rows={rows}
		  columns={columns}
		  editMode="row"
		  rowModesModel={rowModesModel}
		  onRowModesModelChange={handleRowModesModelChange}
		  onRowEditStop={handleRowEditStop}
		  processRowUpdate={processRowUpdate}
		  slots={{
			toolbar: EditToolbar as GridSlots['toolbar'],
		  }}
		  slotProps={{
			toolbar: { setRows, setRowModesModel },
		  }}
		/>
	  </Box>
	);
}






// -- event grid compenent
const event_columns: GridColDef<eventItem>[] = [
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
		  type="datetime-local"   // datetime selector
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
		  type="datetime-local"   // datetime selector
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
		  maxRows={4}     // allow for multiline input
		/>
	  ),
	},/*
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
	},*/
	// add event button
	{
	  field: "actions",
	  type: "actions",
	  width: 150,
	  getActions: (params: GridRowParams<eventItem>) => [
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
		</Button>
	  ],
	},
	{
	  field: 'delete',
	  headerName: '',
	  type: "actions",
	  getActions: (params: GridRowParams<eventItem>) => [
		  <Button
			variant="contained"
			size="small"
			onClick={() => handleDeleteEvent(params)}
		  >
			Delete
		  </Button>
	  ],
	},
  ];







export function EventsList() {
    const [data, setData] = useState<eventItem[]>([]);
    const [showNewRow, setShowNewRow] = useState(false);    // blank row for add new
    

    // -- get user id
    let userId = getUserId();	//window.sessionStorage.getItem('id');

    // -- default new event 
    const new_event: eventItem = { 
        id: -1,
        user_id: userId,
        name: '', 
        description: '', 
        start_time: '', 
        end_time: '', 
        status: '' 
    };


    // -- fetch event data when the component mounts
    useEffect(() => {
        request<eventItem[]>(config.endpoint.events + `/fetchEvents/${userId}`, 'GET')
        .then((response) => {
            setData(response);    // update state with the fetched data
        });
    }, []);


    // -- show / hide Add Event row
    const showAddEvent = () => { setShowNewRow(true) };
    const hideAddEvent = () => { setShowNewRow(false) };


    // -- handle save event data from grid + update display table data
    const handleSaveEvent = async (params: GridRowParams<eventItem>) => {
      const { row } = params;
      try {
          if (row.id === -1) {          // add new event
              const new_event = await postEvent(row);
              if ( new_event ) {
                  setData((prevData) => [...prevData, new_event]);
                  row.id = new_event.id;
              } else {
                  sendMessage('error', "Add event failed")
              }

          } else {                      // update existing event
              const updated_event = await putEvent(row);
              if ( updated_event ) {
                  //setData((prevData) => prevData.map((event) => (event.id === row.id ? updated_event : event)));
              } else {
                  sendMessage('error', "Update event failed")
              }
          }
          // hide Add Event row and reset new_event
          hideAddEvent();
          new_event.name = '';
          new_event.description = '';
          new_event.start_time = '';
          new_event.end_time = '';
          new_event.status = '';
      } catch (error) {
          console.error("Error saving event:", error);
      }
  };


      // -- handle delete event   
    const handleDeleteEvent = async (params: GridRowParams<eventItem>) => {
        const { row } = params;
        try {
            await deleteEvent(row);
        } catch (error) {
            sendMessage('error', "Delete event failed")
            console.error("Error deleting event:", error);
        }
        sendMessage('success', "Delete event success")
    };


    


    // -- update rows in data grid
    const handleProcessRowUpdate = (updatedRow, originalRow) => {
		request<eventItem>(config.endpoint.events +'/', 'POST', updatedRow)
		.then(async (savedEvent: eventItem) => {        // type the response as Event
			console.log("event saved", savedEvent);
		  
			// refresh the event data after update
			try {
				const refreshedEvents = await request<eventItem[]>(config.endpoint.events + `/fetchEvents/${userId}`, 'GET');
				setData(refreshedEvents);   // update state with fetched data
			} catch (error) {
				console.error("Error refreshing events: ", error);
			}
		})
		.catch((error) => {
			console.log("error", error);
		});
		console.log(data)
		console.log(updatedRow)
	};


    // -- render Agenda page
    return (     
      <div>
        <Button variant="outlined"    // Add Event button
          startIcon={<AddBoxIcon/>} 
          onClick={showAddEvent}
          sx={{
            color: "black", 
            "&:active": { backgroundColor: "black" }
          }}>
          Add Event
        </Button>    
        <div>
        <Box sx={{ 
            width: '70%',
            padding: 5, 
            maxHeight: 10, 
            boxSizing: 'border-box',
          }}>
          <DataGrid                     // Event data grid
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
      </div>  
    );
};
