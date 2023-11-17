/**
 * Prolouge
 * File: host.jsx
 * Description: Displays components relating to the host home screen
 *              
 * Programmer(s): Paul Stuever
 * Date Created: 11/17/2023
 * 
 * Date Revised: 11/17/2023 - File created and working with php backend for room codes
 * 
 * Preconditions: 
 *  @inputs : None 
 * Postconditions:
 *  @returns : Host component
 * Error conditions: None
 * Side effects: None
 * Invariants: None
 * Known Faults: Will need to begin integration with other spotify components
 * **/

//Imports used for react
import React from "react";
//Use redux for grabbing room code and name stuff
import { useSelector } from 'react-redux';

//Host const to return component
const Host = () => {

    //Get the roomcode and username from our redux store
    const { roomCode } = useSelector(state => state.roomCode);
    const { username } = useSelector(state => state.username);

    //Return the html objects to display information
    return (
        <div>{ }
            <p>RoomCode: {roomCode}</p>
            <p>Room Name: {username}</p>
        </div>
    );

};

//Export the component
export default Host