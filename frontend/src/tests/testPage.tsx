import React, { useState } from 'react';
import config from '../config.json';

import { request } from '../API/Requests.ts';
import { CircularProgress } from '@mui/material';
import { testEvents } from './testData.ts';
import HomeBar, { sendMessage, EventTask } from '../styling/components.tsx';

const TestPage: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const handlePostEvent = () => {
        console.log("handlePostEvent");
        setLoading(true);
        for (let ev of testEvents){
            request<EventTask>(config.endpoint.events +'/create', 'POST', ev)
                .then((response) => {
                    console.log("event saved", response)
                    setLoading(false);
                })
                .catch((error) => {
                    // handle login error
                    console.log("error", error);
                    setLoading(false);
                });
        }
    }
    const handDeleteAllEvent = () => {
        console.log("handleDeleteAllEvent");
        setLoading(true);
        request<EventTask>(config.endpoint.events +'/all', 'DELETE')
        .then((response) => {
            console.log("events deleted", response)
            setLoading(false);
        })
        .catch((error) => {
            // handle login error
            console.log("error", error);
            setLoading(false);
        });
    }

    const handleUserFetchAll = () => {
        setLoading(true);
        request(config.endpoint.users + '/fetchAll','GET')
            .then((response) => {
                // handle successful login
                console.log("response", response)
                setLoading(false);
            })
            .catch((error) => {
                // handle login error
                console.log("error", error);
                setLoading(false);
            });
    };
    const handleUserDeleteAll = () => {
        setLoading(true);
        request(config.endpoint.users+'/deleteAll','DELETE')
            .then((response) => {
                // handle successful login
                console.log("response", response)
                setLoading(false);
            })
            .catch((error) => {
                // handle login error
                console.log("error", error);
                setLoading(false);
            });
    };
   
    return (
        <div>
            <HomeBar>
            <div style= {{display:"dflex"}}>
                <h1>Test Page</h1>
            </div>
            {loading && <CircularProgress size={20}  style={{textAlign:"center", padding:3}}/>}
            <br/>
            <div style= {{display:"dflex"}}>
                <button onClick={handleUserFetchAll}>handleUserFetchAll</button>
                <button onClick={handleUserDeleteAll}>handleUserDeleteAll</button>
            </div>
            <br/>
            <div style= {{display:"dflex"}}>
                <button onClick={handlePostEvent}>handlePostEvent</button>
                <button onClick={handDeleteAllEvent}>handDeleteAllEvent</button>
            </div>
            <br/>
            <div style= {{display:"dflex"}}>
                <button onClick={()=>{
                    localStorage.clear()
                    console.log("Local Storage Cleared")
                }}>Clear LocalStorage</button>
                <button onClick={()=>{
                    sessionStorage.clear()
                    console.log("session Storage Cleared")
                }}>Clear sessionStorage</button>
            </div>
            <br/>
            <div style= {{display:"dflex"}}>
                <button onClick={()=>{sendMessage("error", "Test error message") }}>send error message</button>
                <button onClick={()=>{sendMessage('success', "Test success message")}}>send success message</button>
                <button onClick={()=>{sendMessage('info', "Test info message")}}>send info message</button>
                <button onClick={()=>{sendMessage('warning', "Test warning message")}}>send warning message</button>
            </div>
            </HomeBar>
        </div>
    );
};

export default TestPage;