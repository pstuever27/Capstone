import React from "react";
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
// imports palette context to manipulate color palette across components
import PaletteContext from './paletteContext';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { ListItemIcon, Menu } from "@mui/material";
import CloseIcon from '../images/close.png';


import phpAPI from "../phpApi";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { useStackState } from "rooks";

function GuestList () {

    const { makeRequest, phpResponse } = phpAPI();

    const [guestListPopulate, setGuestList] = useState([]);

    const cookie = new Cookies();

    let currentGuests = [];

    const listStyle = {
        color: "white",
        fontWeight: "bolder",
        fontFamily: "proxima-nova, Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
        fontSize: "medium"
    };

    useEffect( () => {
        if (phpResponse) {
            setGuestList(phpResponse.getJSONArray("username"));
        }

    }, [phpResponse])

    const guestList = () => {
        if (!guestListPopulate) {
            <></>
        }
        else {
            guestListPopulate.map((name, index) => (
                <ListItem key="guest" disablePadding>
                    <ListItemButton disableRipple='true' /*onClick={() => {  }}*/>
                        <ListItemText primaryTypographyProps={{ style: listStyle }} primary="hello" />
                        <ListItemIcon>
                            <img src={CloseIcon} id='kickGuestIcon' onClick={console.log('hi')} />
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
            ))
        }
    }

    console.log("Guests:", guestListPopulate);

    useEffect(() => {
        makeRequest('guest-list', cookie.get('roomCode'), null) //Runs room.php to see if the room is still open
    }, [])

    return (
        (!guestListPopulate)
            ?
            <></>
            :
            guestListPopulate.map((name, index) => (
                <ListItem key={name} disablePadding>
                    <ListItemButton disableRipple='true' /*onClick={() => {  }}*/>
                        <ListItemText primaryTypographyProps={{ style: listStyle }} primary="hello" />
                        <ListItemIcon>
                            <img src={CloseIcon} id='kickGuestIcon' onClick={console.log('hi')} />
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
            )));

}

export default GuestList;