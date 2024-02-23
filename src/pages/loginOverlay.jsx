import * as React from 'react';
import clsx from 'clsx';
import { Modal as BaseModal} from '@mui/base/Modal';
import { styled, css } from '@mui/system';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Cookies from 'universal-cookie'


export default function LoginOverlay() {

    const { serverAddress } = useSelector(store => store.serverAddress);

    const { roomCode } = useSelector(store => store.roomCode);

    const [open, setOpen] = React.useState(true);
    const handleClose = () => setOpen(false);

    const cookie = new Cookies();

    cookie.set('roomCode', roomCode, { path: "/#/host/%23/callback"});

    return (
    <div>
        <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: StyledBackdrop }}
        >
        <ModalContent sx={style}>
            <h2 id="unstyled-modal-title" className="modal-title">
            Login to Spotify
            </h2>
            <p id="unstyled-modal-description" className="modal-description">
            In order to host a SongSync, you must log into Spotify
            </p>
            <button className = "login-button" onClick={ () => { window.location.href = `${serverAddress}/Server/Spotify/authCreds.php?roomCode=${roomCode}`; }}>
            Login
            </button>
        </ModalContent>
        </Modal>
    </div>
    );
}

const Backdrop = React.forwardRef((props, ref) => {
    const { open, ...other } = props;
    return (
        <div ref={ref} {...other} />
    );
  });
  
  Backdrop.propTypes = {
    open: PropTypes.bool,
  };

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
  };

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

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
