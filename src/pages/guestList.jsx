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
import { Suspense } from "react";


import phpAPI from "../phpApi";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { useStackState } from "rooks";
import { useForceUpdate } from "@mantine/hooks";

function Loading () {
    return(
        <ListItem>
            <ListItemText primary={"hello"}/>
        </ListItem>
    );
}

function ListMaker ( {guests} ) {

    const listStyle = {
        color: "white",
        fontWeight: "bolder",
        fontFamily: "proxima-nova, Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
        fontSize: "medium"
    };

    const { makeRequest, phpResponse } = phpAPI();

    const cookie = new Cookies();

    console.log('guests: ', guests);

    return(
       <> { (guests) 
        ?
            <>
            {guests.map((name, index) => (
                <ListItem key={name.userName} disablePadding>
                    <ListItemButton disableRipple='true' /*onClick={() => {  }}*/>
                        <ListItemText primaryTypographyProps={{ style: listStyle }} primary={name.userName} />
                        <ListItemIcon>
                            <img src={CloseIcon} id='kickGuestIcon' onClick={() => { makeRequest('kick', cookie.get('roomCode'), name.userName) }} />
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
            ))}
        </>
        :
        <></>
            }
    </>
    )
}

function GuestList () {

    const { makeRequest, phpResponse } = phpAPI();

    const [guestListPopulate, setGuestList] = useState('');

    const cookie = new Cookies();

    useEffect( () => {
        if (phpResponse) {
            if (!phpResponse.status) {
                
                setGuestList(phpResponse);
            }
        }
        console.log("Guests! ", phpResponse)
    }, [phpResponse])

    useForceUpdate((null), [phpResponse])

    useEffect(() => {
        makeRequest('guest-list', cookie.get('roomCode'), null) //Runs room.php to see if the room is still open
    }, [])

    return (
        <Suspense fallback={<Loading />}>
            <ListMaker guests={guestListPopulate}/>
        </Suspense>
    );
}

export default GuestList;