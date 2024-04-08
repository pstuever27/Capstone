/**
 * Prolouge
 * File: drawer.jsx
 * Description: This page is for the side drawer menu bar that contains various functions collapsed. 
 *              
 * Programmer(s): Paul Stuever
 * Date Created: 2/28/2024
 * 
 * Date Revised: 2/29/2024 - Kieran Delaney - Added guest leave button functionality with PHP SQL query
 * 
 * Preconditions: Created or joined a room and on home page.
 *  @inputs : None 
 * Postconditions: Renders collapsable drawer with functional buttons. 
 *  @returns : 
 * Error conditions: None
 * Side effects: None
 * Invariants: None
 * Known Faults: 
 * **/

import React from "react";
import { useContext, useEffect } from "react";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
// imports palette context to manipulate color palette across components
import PaletteContext from './paletteContext';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import BlockIcon from '../images/block.png';
import GuestIcon from '../images/guests.png';
import CloseIcon from '../images/close.png';
import LogoutIcon from '../images/logout.png';
import LoginIcon from '../images/enter.png';
import BackIcon from '../images/back.png';
import Divider from '@mui/material/Divider';
import { ListItemIcon, Menu } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom'
import Switch from '@mui/material/Switch';

import phpAPI from "../phpApi";
import authorizationApi from "../authorizationApi";
import Cookies from "universal-cookie";
import { useSelector } from "react-redux";
import GuestList from "./guestList";
import BlockList from "./blockList";

function SettingsDrawer() {

  const cookie = new Cookies();

  const { palette } = useContext(PaletteContext);

  const [open, setOpen] = React.useState(false);

  const [guestOpen, setGuestOpen] = React.useState(false);

  const [blockedOpen, setBlockedOpen] = React.useState(false);

  const [allowExplicit, setAllowExplicit] = React.useState(cookie.get('explicit'));

  const location = useLocation();

  const { logout: logoutUser } = authorizationApi();
  const { makeRequest, phpResponse } = phpAPI();

  const roomCode = cookie.get('roomCode');
  const username = cookie.get('username');

  const { serverAddress } = useSelector(store => store.serverAddress);

  // //Used for closing the room. 'ok' status says the room was closed, or that the user has successfully left the room
  // useEffect(() => {
  //   if (phpResponse) {
  //     if (phpResponse.status == 'ok') {
  //       window.location.href = '/'; //Goes back to the splash screen
  //     }
  //   }
  // }, [phpResponse])

  useEffect(() => {
    cookie.set('explicit', allowExplicit, { path: '/' });
  }, [allowExplicit])

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const toggleGuests = () => {
    let tmp = !guestOpen
    setGuestOpen(tmp);
  };

  const toggleBlocked = () => {
    let tmp = !blockedOpen;
    setBlockedOpen(tmp);
  };

  const logoutHost = () => {
    logoutUser();
    window.location.href = '/#/host';
  };

  const loginHost = () => {
    window.location.href = `${serverAddress}/Server/Spotify/authCreds.php?roomCode=${roomCode}`;
  };

  const closeRoom = () => {
    makeRequest("close-room", roomCode, null);
    window.location.href = '/';
  };

  const leaveRoom = () => {
    //DONE: Add php for user that leaves
    makeRequest("guest-leave", roomCode, username);
  };

  const guestList = () => {
    //TODO: Add component that displays guest list
    toggleGuests();
  };

  const blockedSongs = () => {
    //TODO: Set up blocked songs list in SQL and make php for it
    toggleBlocked();
  };

  const handleExplicit = () => {
    let tmp = allowExplicit;
    setAllowExplicit(!tmp);
    console.log("Explicit state:", allowExplicit);
  }

  const listStyle = {
    color: "white",
    fontWeight: "bolder",
    fontFamily: "proxima-nova, Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
    fontSize: "medium"
  };

  let listIcons = [LoginIcon, CloseIcon];
  let listText = ['Login to Spotify', 'Close Room'];
  let listButtonFunction = [loginHost, closeRoom];
  let listButtonPosition = ['0', '0'];

  if (location.pathname == '/join') {
    listIcons = [BlockIcon, LogoutIcon];
    listText = ['Blocked Songs', 'Leave Room'];
    listButtonFunction = [blockedSongs, leaveRoom];
  }
  else if (location.hash == '#/callback') {
    listIcons = [GuestIcon, BlockIcon, LogoutIcon, CloseIcon];
    listText = ['Guest List', 'Blocked Songs', 'Logout of Spotify', 'Close Room'];
    listButtonFunction = [guestList, blockedSongs, logoutHost, closeRoom];
    listButtonPosition = ['', '', '0', '0'];
  }

  const DrawerList = (
    <>
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {listText.map((text, index) => (
          <ListItem key={text} disablePadding style={{bottom: `${listButtonPosition[index]}`}}>
            <ListItemButton onClick={listButtonFunction[index]}>
              <ListItemIcon>
                <img src={listIcons[index]} id='drawerIcon' />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{style: listStyle}}primary={text}  />
            </ListItemButton>
          </ListItem>
        ))}
          {location.hash == '#/callback'
            ?
            <ListItem key="explicit" >
              <Switch label="Allow Explicit Songs" disablePadding checked={allowExplicit} onChange={handleExplicit}></Switch>
              <ListItemText primaryTypographyProps={{ style: listStyle }} primary="Allow Explicit Songs" />
            </ListItem>
            :null
          }
        </List>
      </Box>
      <Drawer open={guestOpen} onClose={toggleGuests} BackdropProps={{ invisible: true }} variant='perisistent' anchor='right' PaperProps={{ sx: { background: `linear-gradient(to bottom right, ${palette[0]}, #333333)` } }}>
        <Box sx={{ width: 250 }} role="presentation">
          <ListItem key="back" disablePadding>
            <ListItemButton onClick={() => { guestList; toggleGuests() }}>
              <ListItemIcon>
                <img src={BackIcon} id='drawerIcon' />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ style: listStyle }} primary="Go Back" />
            </ListItemButton>
          </ListItem>
          <Divider variant="middle"/>
          <GuestList />
        </Box>
      </Drawer>
      <Drawer open={blockedOpen} onClose={toggleBlocked} BackdropProps={{ invisible: true }} variant='perisistent' anchor='right' PaperProps={{ sx: { background: `linear-gradient(to bottom right, ${palette[0]}, #333333)` } }}>
        <Box sx={{ width: 250 }} role="presentation">
          <ListItem key="back" disablePadding>
            <ListItemButton onClick={() => { blockedSongs; toggleBlocked() }}>
              <ListItemIcon>
                <img src={BackIcon} id='drawerIcon' />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ style: listStyle }} primary="Go Back" />
            </ListItemButton>
          </ListItem>
          <Divider variant="middle"/>
          <BlockList />
        </Box>
      </Drawer>
    </>
  );

  if(!palette[0]) {
    palette[0] = 'rgb(0, 163, 103)';
  }

  return (
    <>
      <div id="drawertwo" >
        <button id='drawerButton' onClick={toggleDrawer(true)} style={{ backgroundColor: 'transparent' }}><MenuIcon fontSize="large" style={{ color: 'white' }}/></button>
        <Drawer PaperProps={{ sx: { background: `linear-gradient(to bottom right, ${palette[0]}, #333333)` } }} anchor='right' open={open} onClose={toggleDrawer(false)} BackdropProps={{ invisible: true }}>
          {DrawerList}
        </Drawer>
      </div>
    </>
  )
}

export default SettingsDrawer