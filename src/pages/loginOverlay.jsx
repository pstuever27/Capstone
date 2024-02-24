/**
 * Prolouge
 * File: loginOverlay.jsx
 * Description: Component to show overlay which tells the host they need to log into Spotify to use our app 
 *              
 * Programmer(s): Paul Stuever
 * Date Created: 2/24/2024
 * 
 * Preconditions: 
 *  @inputs : None 
 * Postconditions:
 *  @returns : 
 * Error conditions: None
 * Side effects: None
 * Invariants: None
 * Known Faults: 
 * **/

//Necessary imports
import * as React from 'react';
import { Modal as BaseModal} from '@mui/base/Modal';
import { styled, css } from '@mui/system';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Cookies from 'universal-cookie'

//Begin component
export default function LoginOverlay() {

    //Get current server address based on build type
    const { serverAddress } = useSelector(store => store.serverAddress);

    //Get roomCode from redux
    const { roomCode } = useSelector(store => store.roomCode);

    //'open' tells the overlay what state it should be in
    const [open, setOpen] = React.useState(true);
    const handleClose = () => setOpen(false); //Closes the overlay

    //Gets cookie information
    const cookie = new Cookies();

    //Sets cookie for callback, may not be necessary
    cookie.set('roomCode', roomCode, { path: "/#/host/%23/callback"});

  return (
    <div> { /*This Modal is used to show the overlay using our mui component library.*/}
        <Modal
        aria-labelledby="unstyled-modal-title" 
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: StyledBackdrop }}
        >
        {/*ModalContent is defined further down, and shows the text/button displayed in the popup*/ }
        <ModalContent sx={style}>
            <h2 id="unstyled-modal-title" className="modal-title">
            Login to Spotify
            </h2>
            <p id="unstyled-modal-description" className="modal-description">
            In order to host a SongSync, you must log into Spotify
            </p>
            {/*This button will run the php which logs you into Spotify*/}
            <button className = "login-button" onClick={ () => { window.location.href = `${serverAddress}/Server/Spotify/authCreds.php?roomCode=${roomCode}`; }}>
            Login
            </button>
        </ModalContent>
        </Modal>
    </div>
    );
}

//This const sets up the backdrop to where it greys out the background and is clickable
const Backdrop = React.forwardRef((props, ref) => {
    const { open, ...other } = props;
    return (
        <div ref={ref} {...other} />
    );
  });
  
  Backdrop.propTypes = {
    open: PropTypes.bool,
  };

//Modal styling. TODO: move to css file
const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

//General style TODO: move to css file
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
  };

//Style the backdrop. TODO: move to css file
const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

//Style the content in the modal. TODO: move to css file
const ModalContent = styled('div')(
({ theme }) => css`
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: grey;
    border-radius: 8px;
    box-shadow: 0 4px 12px
    ${theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 0.5)' : 'rgb(0 0 0 / 0.2)'};
    padding: 24px;
    color: white;

    & .modal-title {
    margin: 0;
    line-height: 1.5rem;
    margin-bottom: 8px;
    }

    & .modal-description {
    margin: 0;
    line-height: 1.5rem;
    font-weight: 400;
    color: white;
    margin-bottom: 4px;
    }

    & .login-button {
      width: 100%;
      height: 50px;
      border-radius: 7px;
      border: none;
      background-color: white;
      color: black;
      font-weight: 550;
      font-size: 16px;
      transition: color 0.3s linear, box-shadow 0.3s ease-in-out;
      cursor: pointer;
    }

    & .login-button:hover {
        box-shadow: 0px 0px 30px -5px rgba(0,0,0,1);
    }
`,
);
