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
import { Backdrop } from '@mui/material';

import phpAPI from "../phpApi";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { useForceUpdate } from "@mantine/hooks";

function ListMaker ( {blocked} ) {

    const listStyle = {
        color: "white",
        fontWeight: "bolder",
        fontFamily: "proxima-nova, Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
        fontSize: "medium"
    };

    const { makeRequest, phpResponse } = phpAPI();

    const cookie = new Cookies();

    console.log(blocked);

    // const confirmationOverlay = (open) => {(
    // <>
    //     <Menu
    //     id="basic-menu"
    //     anchorEl={anchorEl}
    //     open={open}
    //     onClose={setAnchorEl(null)}
    //     MenuListProps={{
    //       'aria-labelledby': 'basic-button',
    //     }}
    //     >
    //     <MenuItem onClick={handleClose}>Delete from BlockList?</MenuItem>
    //   </Menu>
    // </>
    // )}

    return(
       <> {      
        (blocked) 
        ?
            <>
            {blocked.map((id, index) => (
                <ListItem key={id.name} disablePadding>
                    <ListItemButton disableRipple='true' /*onClick={() => {  }}*/>
                        <ListItemText primaryTypographyProps={{ style: listStyle }} primary={id.name} />
                        <ListItemIcon>
                            <img src={CloseIcon} id='kickGuestIcon' onClick={() => { makeRequest('remove-block', cookie.get('roomCode'), id.userName) }} />
                            <confirmationOverlay />
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

function BlockList () {

    const { makeRequest, phpResponse } = phpAPI();

    const [blockListPopulate, setBlockList] = useState('');

    const cookie = new Cookies();

    useEffect( () => {
        if (phpResponse) {
            if (!phpResponse.status) {
                setBlockList(phpResponse);
            }
        }
        console.log("Blocked: ", phpResponse)
    }, [phpResponse])

    useForceUpdate((null), [phpResponse])

    useEffect(() => {
        makeRequest('block-list', cookie.get('roomCode'), null) //Runs room.php to see if the room is still open
    }, [])

    return (
        <ListMaker blocked={blockListPopulate}/>
    );
}

export default BlockList;