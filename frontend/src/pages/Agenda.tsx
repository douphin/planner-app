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
import { FullFeaturedCrudGrid } from '../styling/tasksComponents.tsx';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
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
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';

let userId = getUserId();   // get user id


interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, eid: -1, user_id: userId, name: '', description: '', start_time: '', end_time: '', status: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add event
      </Button>
    </GridToolbarContainer>
  );
}




function AgendaPage() {
  /*
  const [data, setData] = useState<eventItem[]>([]);
  let userId = getUserId();

	// -- fetch event data when the component mounts
	useEffect(() => {
		request<eventItem[]>(config.endpoint.events + `/fetchEvents/${userId}`, 'GET')
		.then((response) => {
			setData(response);    // update state with the fetched data
		});
	}, []);
  */
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  useEffect(() => {
      request<eventItem[]>(config.endpoint.events + `/fetchEvents/${userId}`, 'GET')
          .then(response => {
              if (Array.isArray(response)) {
                  const newRows = response.map(event => ({
                      id: randomId(),     // row id
                      eid: event.id,      // backend event id
                      user_id: userId,
                      name: event.name,
                      description: event.description,
                      start_time: randomCreatedDate(), //formatDate(event.start_time), 
                      end_time: randomCreatedDate(),  //formatDate(event.end_time), 
                      status: event.status,
                  }));
                  setRows(newRows); // update rows directly
              } else {
                  // handle error: Unexpected response format
              }
          });
  }, []);
 

	// --------------
	const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true;
		}
	};

	const handleEditClick = (id: GridRowId) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
	};

	const handleSaveClick = (params: GridRowParams) => async () => { 
		const id = params.id;
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    ///*
		try {
			const editedRow = params.row;
			if (!editedRow) return; 	// handle case where row isn't found

			const eventRow = {
				//id: editedRow.id,
				user_id: editedRow.user_id,
				name: editedRow.name,
				description: editedRow.description,
				start_time: editedRow.start_time,
				end_time: editedRow.end_time,
				status: editedRow.status
			};

			if (editedRow.isNew) {
				// POST new event to the backend
				request( config.endpoint.events + '/add', 'POST', eventRow )
				.then((response) => {
					sendMessage('success', `Added event!`)
					//sendMessage('success', `Added ${editedRow.name}!`)
					editedRow.eid = response.id;
          const updatedRow = { ...editedRow, isNew: false }; 
				})
				.catch((errorMessage) => {
					sendMessage('error', "Add event failed: " + errorMessage)
					console.log("error", errorMessage);
				});
			} else {
				// PUT updated event to the backend
				sendMessage('success', `Added ${editedRow.eid}!`)
				await request( config.endpoint.events + `/update/${editedRow.eid}`, 'PUT', eventRow )
				.then((response) => {
					sendMessage('success', `Updated event!`)
				})
				.catch((errorMessage) => {     
					sendMessage('error', "Update event failed: " + errorMessage)
					console.log("error", errorMessage);
				});
			}
			setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
		} catch (error) {
			sendMessage('error', "Update event Failed:")
		}
    //*/
	};

	const handleDeleteClick = (params: GridRowParams) => async () => {
      const id = params.id;
      try {
          await deleteEvent(params.row.eid);
          // update the UI after successful deletion
          setRows(rows.filter((row) => row.id !== id));
      } catch (error) {
          sendMessage('error', "Deleted event Failed: " + error)
          console.error('Error deleting event:', error);
      }
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

  const processRowUpdate = async (newRow: GridRowModel) => {
    const eventRow = {
      user_id: newRow.user_id,
      name: newRow.name,
      description: newRow.description,
      start_time: newRow.start_time,
      end_time: newRow.end_time,
      status: newRow.status
    };
    try {
        // save the event to the backend
        if (newRow.isNew) {
          // POST new event to the backend
          request( config.endpoint.events + '/add', 'POST', eventRow )
          .then((response) => {
            sendMessage('success', `Added event!`)
            //sendMessage('success', `Added ${editedRow.name}!`)
            newRow.eid = response.id;
            const updatedRow = { ...newRow, isNew: false }; 
          })
          .catch((errorMessage) => {
            sendMessage('error', "Add event failed: " + errorMessage)
            console.log("error", errorMessage);
          });
        } else {
          const savedEvent = await request( config.endpoint.events + `/update/${newRow.eid}`, 'PUT', eventRow );
        }
        // update UI
        setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)));

        return newRow; 
    } catch (error) {
        sendMessage('error', "(processRowUpdate) save event Failed:" + error);
        console.error('Error saving event:', error);
        // handle the error
        return newRow;    // return the original newRow if the save fails
    }
  };


  /*
	const processRowUpdate = (newRow: GridRowModel) => {
		request<eventItem>(config.endpoint.events +'/', 'POST', newRow)
		.then(async (savedEvent: eventItem) => {        // type the response as Event
			console.log("event saved", savedEvent);
		  
			// refresh the event data after update
			try {
				const refreshedEvents = await request<eventItem[]>(config.endpoint.events + `/fetchEvents/${userId}`, 'GET');
				setRows(refreshedEvents);   // update state with fetched data
			} catch (error) {
				console.error("Error refreshing events: ", error);
			}
		})
		.catch((error) => {
			console.log("error", error);
		});

		const updatedRow = { ...newRow, isNew: false };
		setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
		return updatedRow;
	};
  //*/

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	const columns: GridColDef[] = [
		{ field: 'name', headerName: 'Name', width: 180, editable: true },
		{ field: 'description', headerName: 'Description', width: 180, editable: true, },
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
			getActions: (params: GridRowParams) => {		//getActions: ({ id }) => {
				const id = params.id;
				const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
				if (isInEditMode) {
				return [
					<GridActionsCellItem
					icon={<SaveIcon />}
					label="Save"
					sx={{
						color: 'primary.main',
					}}
					onClick={handleSaveClick(params)}
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
					onClick={handleDeleteClick(params)}
					color="inherit"
				/>,
				];
			},
			},
	];

    // -- render Agenda page
    return (
      <div>
        <EnsureLoggedIn>
          <HomeBar>
            <div className="content">
                {/* <EventsList /> */}
                {/*<FullFeaturedCrudGrid data={data}/>*/}
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
    
    
