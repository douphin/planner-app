import {request} from './Requests.ts'
import config from '../config.json';
import { NavigateFunction } from "react-router-dom";
import { sendMessage, eventItem } from '../styling/components.tsx';
//import user from '../../../backend/models/user.js';
import { all } from 'axios';

// ==================== LOG IN ==================== //

export interface loginData {
    name : string, 
    password : string
}

export async function getLogin(data : loginData){    
    let name = data.name
    let password  = data.password
    let loggedIn = false

    await request(config.endpoint.users + '/login', 'POST', { name, password })
        .then((response) => {
            if(response != null){
                console.log("response", response)
                sendMessage('success', "Login Successful")
                localStorage.setItem("jwt", JSON.stringify(data["token"]))
                window.sessionStorage.setItem("id", JSON.stringify(response.user.id))   // store user id
                
            }
            else {
                console.log("data is null")
            }
            loggedIn = true
        })
        .catch((errorMessage) => {
            console.log("error", errorMessage);
            sendMessage('error', "Login  Failed:" + errorMessage) 
        });
    return loggedIn
};

// ==================== USERS ==================== //

export interface userData {
    email : string, 
    name : string, 
    password : string
}
export async function postUser(data : userData):Promise<boolean>{
    let email = data.email
    let name = data.name
    let password  = data.password
    let isRegistered = false
    await request(config.endpoint.users +'/Register', 'POST', { name, email, password })
        .then((response) => {
            // handle successful login
            console.log("response", response)
            sendMessage('success', "Register Successful")
            isRegistered = true
        })
        .catch((errorMessage) => {
            // handle login error
            console.log("error", errorMessage);            
            sendMessage('error', "Regstration  Failed:" + errorMessage)
        });
    return isRegistered
};
export const HandleLogout = (navigate: NavigateFunction)=>{
    localStorage.clear()
    navigate('/Login')
};





// --- get user id as int
export const getUserId = () => {
    let u_id = window.sessionStorage.getItem('id');
    try {      
        if (!u_id) {
            return -1;
        }
        const user_id = parseInt(u_id, 10);
        return user_id;
    } catch (error) {
        return -1;
    }
};


// ==================== Events Data ==================== //


// --- get number of events for user
export async function getEventCount(): Promise<number> {
    try {
        // get session / current user id
        let c_id = window.sessionStorage.getItem('id');     
        if (!c_id) {
            sendMessage('error', "Account not logged in");
            return -1;
        }
        const user_id = parseInt(c_id, 10);
        
        // fetch events for user
        const response = await request<eventItem[]>(
            `${config.endpoint.events}/fetchEvents/${user_id}`, 'GET'
        );
        if (!response) { return -1; }

        // get length
        const item_count = response.length;

        return item_count;
    } catch (error) {
        sendMessage('error', "Failed to count");
        return -1;
    }
};




export interface Event {
    user_id: number,
    name: string,
    description: string,
    start_time: string,
    end_time: string,
    status: string
  }

// --- POST event
export async function postEvent(e: eventItem): Promise<eventItem | null> {
    //{ user_id: e.user_id, name: e.name, description: e.description, start_time: e.start_time, end_time: e.end_time, status: e.status }
    const new_event : Event = { 
        user_id: e.user_id, 
        name: e.name, 
        description: e.description, 
        start_time: e.start_time, 
        end_time: e.end_time, 
        status: e.status 
    }

    // add event
    request<Event>( config.endpoint.events + '/add', 'POST', new_event )
    .then((response) => {
        sendMessage('success', `Added ${new_event.name}!`)
        e.id = response.id;
    })
    .catch((errorMessage) => {
        console.log("error", errorMessage);            
        return null;
    });
    return e;
};


// --- UPDATE event
export async function putEvent(e: eventItem): Promise<eventItem | null>  {
    const updated_event : Event = { 
        user_id: e.user_id, 
        name: e.name, 
        description: e.description, 
        start_time: e.start_time, 
        end_time: e.end_time, 
        status: e.status 
    }

    // update event
    await request<Event>( config.endpoint.events + `/update/${e.id}`, 'PUT', updated_event )
    .then((response) => {
        sendMessage('success', `Updated ${e.name}!`)
    })
    .catch((errorMessage) => {
        console.log("error", errorMessage);            
        sendMessage('error', "Update event Failed:" + errorMessage)
        return null;
    });
    return e;
};



// --- DELETE event
export async function deleteEvent(e: eventItem) {
    sendMessage('success', `Deleted ${e.id}!`)
    // delete event
    await request( config.endpoint.events + `/del/${e.id}`, 'DELETE')
    .then((response) => {
        sendMessage('success', `Deleted ${e.name}!`)
    })
    .catch((errorMessage) => {
        console.log("error", errorMessage);            
        sendMessage('error', "Deleted event Failed:" + errorMessage)
    });
};


