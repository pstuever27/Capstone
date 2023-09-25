const globals = {
    errorTimeout: -1,
    username: null,
    roomCode: null,
    id: null
};

const $ = (id) => document.getElementById(id);

const hideError = () => {
    $('error').classList.remove('show');
};
const throwError = (msg) => {
    $('error-message').innerText = msg;
    $('error').classList.add('show');
    window.setTimeout(hideError, 5000);
};

const hideCode = () => {
    $('code-box').classList.remove('show');
}

const showCode = (msg, code) => {
    $('code-box-message').innerText = msg;
    $('code-box-code').innerText = code;
    $('code-box').classList.add('show');
    window.setTimeout(hideCode, 10000);
}

const phpAPI = (url, roomCode, callBack) => {
    //Will update later with real functionality, just need to make sure server calls work for now.
const xhr = new XMLHttpRequest();
  xhr.open('POST', `Server/${url}.php`, true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
        let response;
        try {
            response = JSON.parse(xhr.responseText);
            if (response.status === 'error') {
                throwError(response.error);
            }
            else {
                callBack(response);
            }
        }
        catch (err) {
            console.log("here?");
            throwError(err);
        }
    }
  };
  xhr.send('roomCode=' + roomCode);
};

const genCode = () => {
    // Game Code Generation ~~~~~~~~
    const chars = 'abcdefghijklmnpqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    var code = '';
    for (var i = 0; i < 4; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
};

const host = () => {
    var roomCode = genCode();
    phpAPI('host', roomCode, (response) => {
        console.log(response.status);
        if (response.status === 'ok') {
            showCode("Room Generated!", roomCode);
        }
        else {
            //If that roomcode is already taken, then generate another one.
            roomCode = genCode();
            host();
        }
    });
    return;
};

const join = () => {
    const regex = /^[a-zA-Z0-9]+$/;
    const roomCodeInput = $('room-code');
    const roomCode = roomCodeInput.value;
    if(roomCode.length != 4 || !regex.test(roomCode)) {
        throwError("Invalid Room Code!");
        return;
    }
    phpAPI('join', roomCode, (response) => {
        console.log(response);
        if( response.status === 'ok' ) {
            showCode("Room Found!", roomCode)
        }
    });
};

window.onload = async () => {

    $('host-button').addEventListener('click', host);
    $('join-button').addEventListener('click', join);
};