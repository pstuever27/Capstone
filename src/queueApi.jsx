import { QueuePlayNextOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { useSelector } from 'react-redux';

function throwError(error) {
    console.log(error);
}

const queueAPI = () => {
    const { serverAddress } = useSelector(store => store.serverAddress );

    const [phpResponse, setResponse] = useState(null);

    const makeRequest = (phpUrl, roomCode, queueList) => {

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${serverAddress}/Server/${phpUrl}.php`, true);
        //Open the PHP file
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        //When the PHP file is done, this will get called
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200){
                let response;
                try{

                    if(response?.status === 'error') {
                        throwError(response.error);
                    }
                    else{
                        setResponse(response);
                    }
                } 
                catch(err){
                    throwError(err);
                }
            }

        }
        var json = (JSON.stringify(queueList));
        xhr.send('roomCode=' + roomCode + '&queueList=' + json);

    }
    return { makeRequest, phpResponse };
}
export default queueAPI