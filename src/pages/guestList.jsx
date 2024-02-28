import React from "react";
import List from '@mui/material/List';
import Box from '@mui/material/Box';
// imports palette context to manipulate color palette across components
import PaletteContext from './paletteContext';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { ListItemIcon, Menu } from "@mui/material";

import phpAPI from "../phpApi";
import { useEffect } from "react";
import Cookies from "universal-cookie";


function GuestList () {

    const {makeRequest, phpResponse} = phpAPI();

    const cookie = new Cookies();

    let currentGuests = [];

    useEffect( () => {
        if(phpResponse) {
            if(phpResponse.userName){
                currentGuests = phpResponse.values();
            }
        }
    }, [phpResponse])

    console.log("Guests:", currentGuests);

    useEffect(() => {
        makeRequest('guest-list', cookie.get('roomCode'), null) //Runs room.php to see if the room is still open
    }, [])

    return(
        <>
            
        </>
    );

}

export default GuestList;