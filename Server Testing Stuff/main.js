// const mysql = require('mysql');
// const connection = new mysql.createConnection({
//     host: 'localhost',
//     user: 'pstuever27',
//     password: 'AVaPooTy1053',
//     database: 'TABLES'
// })

// connection.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = "INSERT INTO room (roomCode) VALUES ?";
//     var value = "ABCD";
//     connection.query(sql, value, function (err, result) {
//         if (err) throw err;
//         console.log("Inserted!");
//     });
// });

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

const phpAPI = (url, roomCode, callBack) => {
    //Will update later with real functionality, just need to make sure server calls work for now.
const xhr = new XMLHttpRequest();
  xhr.open('POST', `Server/${url}.php`, true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText);
    }
  };
  //let response = JSON.parse(xhr.responseText);
  //callBack(response);
  xhr.send('roomCode='+roomCode);
};

const host = () => {
    // Game Code Generation ~~~~~~~~
    const chars = 'abcdefghijklmnpqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    var code = '';
    for(var i = 0; i < 4; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    console.log("RoomCode:", code);
    phpAPI('host', code);
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
        console.log(response.roomCode);
        if(roomCode == response.roomCode ) {
            console.log("Joined!");
        }
    });
};

window.onload = async () => {

    $('host-button').addEventListener('click', host);
    $('join-button').addEventListener('click', join);
};