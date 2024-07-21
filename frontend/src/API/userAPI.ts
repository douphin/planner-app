import {request} from './Requests.ts'
import config from '../config.json';
import { NavigateFunction } from "react-router-dom";
import { sendMessage } from '../styling/components.tsx';
import { EventTask } from '../styling/components.tsx';

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
            sendMessage('error', "Rigstration  Failed:" + errorMessage)
        });
    return isRegistered
};
export const HandleLogout= (navigate:NavigateFunction)=>{
    localStorage.clear()
    navigate('/Login')
};



export async function postEvent(data : EventTask):Promise<boolean>{
    let user_id = data.user_id
    let name = data.name
    let description = data.description
    let start_time = data.start_time
    let end_time = data.end_time
    let status = data.status
    let event_added = false
    await request<EventTask>(config.endpoint.events + '/', 'POST', { user_id: user_id, name: name, description:description, start_time:start_time, end_time:end_time, status:status })
        .then((response) => {
            // handle successful 
            console.log("response", response)
            sendMessage('success', "Add Event Successful")
            event_added = true
        })
        .catch((errorMessage) => {
            // handle error
            console.log("error", errorMessage);            
            sendMessage('error', "Add Event Failed:" + errorMessage)
        });
    return event_added
};
