/**
 * Prolouge
 * File: host.jsx
 * Description: Component to display host information on the home screen after room setup
 * Programmer's Name: Paul Stuever
 * Date Created: 11/5/2023
 * Date Revised: 11/5/2023 - Paul Stuever - File created, began jsx setup
 * Preconditions: 
 *  @inputs : None
 * Postconditions:
 *  @returns : React component
 * Error conditions:
 * Side effects: None
 * Invariants: None
 * Known Faults: Needs more work to get integrated with React
 * **/

import React from "react";
import phpAPI from '../phpApi'
import { useState, useEffect } from 'react'

const Host = () => {

    let roomCode = "ABCD";
    let roomName = "dummy";

    const { makeRequest, phpResponse } = phpAPI("host", roomCode, roomName);
    useEffect(() => {
        makeRequest();
    }, []);
    
    let finalResponse;
    if(phpResponse != null) {
        finalResponse = phpResponse.roomName;
    }
    else {
        finalResponse = '----';
    }
    return(
        <div>{}
            <p>RoomCode: ABCD</p>
            <p>Room Name: {finalResponse.roomName}</p>
        </div>
    );

};

export default Host