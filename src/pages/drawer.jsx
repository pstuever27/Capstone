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

function SettingsDrawer() {

  const { palette } = useContext(PaletteContext);

  const [open, setOpen] = React.useState(false);

  const location = useLocation();

  const { logout: logoutUser } = authorizationApi();
  const { makeRequest, phpResponse } = phpAPI();

  const cookie = new Cookies();

  const roomCode = cookie.get('roomCode');

  const { serverAddress } = useSelector(store => store.serverAddress);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
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
  };

  const blockedSongs = () => {
    //TODO: Set up blocked songs list in SQL and make php for it
  };

  let listIcons = [LoginIcon, CloseIcon];
  let listText = ['Login to Spotify', 'Close Room'];
  let listButtonFunction = [loginHost, closeRoom];

  if (location.pathname == '/join') {
    listIcons = [LogoutIcon];
    listText = ["Leave Room"];
    listButtonFunction = [leaveRoom];
  }
  else if (location.hash == '#/callback') {
    listIcons = [GuestIcon, BlockIcon, LogoutIcon, CloseIcon];
    listText = ['Guest List', 'Blocked Songs', 'Logout of Spotify', 'Close Room'];
    listButtonFunction = [guestList, blockedSongs, logoutHost, closeRoom];
  }

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {listText.map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={listButtonFunction[index]}>
              <ListItemIcon>
                <img src={listIcons[index]} id='drawerIcon' />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  console.log('Color:', palette[1])

  return (
    <>
      <div id="drawertwo" >
        <button id='drawerButton' onClick={toggleDrawer(true)} style={{ backgroundColor: 'transparent' }}><MenuIcon fontSize="large" /></button>
        <Drawer PaperProps={{ sx: { background: `linear-gradient(to bottom right, ${palette[0]}, #333333)` } }} anchor='right' open={open} onMouseLeave={toggleDrawer(false)} onClose={toggleDrawer(false)} DrawerListProps={{ onMouseLeave: toggleDrawer(false), onMouseEnter: toggleDrawer(true) }} BackdropProps={{ invisible: true }}>
          {DrawerList}
        </Drawer>
      </div>
    </>
  )
}

export default SettingsDrawer