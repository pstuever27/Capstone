/**
 * Prolouge
 * File: Join.jsx
 * Description: Component to display Join information on the home screen after room setup
 * Programmer's Name: Paul Stuever
 * Date Created: 11/5/2023
 * Date Revised: 11/5/2023 - Paul Stuever - File created, began jsx setup
 * Date Revised: 11/17/2023 - Paul Stuever - Refactored to better fit jsx setup and allow to be displayed from App.jsx
 * Preconditions: 
 *  @inputs : None
 * Postconditions:
 *  @returns : React component
 * Error conditions:
 * Side effects: None
 * Invariants: None
 * Known Faults: Need to integrate other components to show spotify information
 * **/


//Imports, redux used for project 'globals'
import React from "react";
import { useSelector } from 'react-redux';

//Join component to return room info
const Join = () => {

    //Grab roomCode and username from redux slice
    const { roomCode } =  useSelector( state => state.roomCode );
    const { username } =  useSelector( state => state.username );

    //Return div containing information
    return(
        <div>{}
            <p>RoomCode: { roomCode }</p>
            <p>Name: { username }</p>
        </div>
    );

};

//Export component
export default Join