/**
 * Prolouge
 * File: Join.jsx
 * Description: Component to display Join information on the home screen after room setup
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
import { useSelector } from 'react-redux';

const Join = () => {

    const { roomCode } =  useSelector( state => state.roomCode );
    const { username } =  useSelector( state => state.username );

    return(
        <div>{}
            <p>RoomCode: { roomCode }</p>
            <p>Room Name: { username }</p>
        </div>
    );

};

export default Join