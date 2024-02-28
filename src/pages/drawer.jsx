import React from "react";
import { useContext } from "react";
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
import { ListItemIcon, Menu } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom'

import phpAPI from "../phpApi";
import authorizationApi from "../authorizationApi";
import Cookies from "universal-cookie";
import { useSelector } from "react-redux";
import GuestList from "./guestList";

function SettingsDrawer() {

  const { palette } = useContext(PaletteContext);

  const [open, setOpen] = React.useState(false);

  const [guestOpen, setGuestOpen] = React.useState(false);

  const [blockedOpen, setBlockedOpen] = React.useState(false);

  const location = useLocation();

  const { logout: logoutUser } = authorizationApi();
  const { makeRequest, phpResponse } = phpAPI();

  const cookie = new Cookies();

  const roomCode = cookie.get('roomCode');

  const { serverAddress } = useSelector(store => store.serverAddress);

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
  };

  const leaveRoom = () => {
    //TODO: Add php for user that leaves
    window.location.href = '/';
  };

  const guestList = () => {
    //TODO: Add component that displays guest list
    toggleGuests();
  };

  const blockedSongs = () => {
    //TODO: Set up blocked songs list in SQL and make php for it
    toggleBlocked();
  };

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
    listIcons = [LogoutIcon];
    listText = ["Leave Room"];
    listButtonFunction = [leaveRoom];
  }
  else if (location.hash == '#/callback') {
    listIcons = [GuestIcon, BlockIcon, LogoutIcon, CloseIcon];
    listText = ['Guest List', 'Blocked Songs', 'Logout of Spotify', 'Close Room'];
    listButtonFunction = [guestList, blockedSongs, logoutHost, closeRoom];
    listButtonPosition = ['', '', '0', '0'];
  }

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {listText.map((text, index) => (
          <ListItem key={text} disablePadding style={{bottom: `${listButtonPosition[index]}`}}>
            <ListItemButton onClick={listButtonFunction[index]}>
              <ListItemIcon>
                <img src={listIcons[index]} id='drawerIcon' />
                <Drawer open={guestOpen} onClose={toggleGuests} BackdropProps={{ invisible: true }} anchor='right' PaperProps={{ sx: { background: `linear-gradient(to bottom right, ${palette[0]}, #333333)` } }}>
                  <Box sx={{ width: 250 }} role="presentation">
                    <p>Guests</p>
                  </Box>
                </Drawer>
                <Drawer open={blockedOpen} onClose={toggleBlocked} BackdropProps={{ invisible: true }} anchor='right' PaperProps={{ sx: { background: `linear-gradient(to bottom right, ${palette[0]}, #333333)` } }}>
                  <Box sx={{ width: 250 }} role="presentation">
                    <p>Blocked</p>
                  </Box>
                </Drawer>
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{style: listStyle}}primary={text}  />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
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