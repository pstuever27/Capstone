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

function getRoomInfo() {
    //Will use localStorage to get the roomCode from the login screen. For now, I am just going to load in dummy data
    let roomCode = "ABCD";
    let roomName = "dummy";
    let response;

    const { makeRequest } = phpAPI("host"); 
    useEffect(() => {
        response = makeRequest()
    }, [])

    return;
}

const Host = () => {

    const response = getRoomInfo();
    console.log(response);
    return(
        <div>{}
            <p>RoomCode: </p>
            <p>Room Name: </p>
        </div>
    );

};

export default Host