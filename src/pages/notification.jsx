import { useEffect } from 'react';
import { useState } from 'react' 
import Snackbar from '@mui/material/Snackbar';
import { IconButton } from '@mui/material';
import CloseIcon from '../images/close.png';



function Notification( {message, openState} ) {

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    }

    useEffect( () => {
        if(message != null) {
            setOpen(true);
        }
        
    }, [message]);

    const close = ( 
        <>
            <IconButton
                fontsize="large"
                color="inherit"
                onClick={handleClose}
            >
                <img src={CloseIcon} id="notifClose"/>
            </IconButton>
        </>
    )

    return(
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={message}
          action={close}
        />
    )

}

export default Notification;