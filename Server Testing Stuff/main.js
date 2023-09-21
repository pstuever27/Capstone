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

const phpAPI = (url, callback) => {
    //Will update later with real functionality, just need to make sure server calls work for now.

};

const host = () => {
    const regex = /^[a-zA-Z0-9]+$/;

    // TODO: Name entry (Should be 3 < x < 32 chars)

    // Game Code Generation ~~~~~~~~
    code = (Math.random()).toString(36).substring(9);
    console.log("RoomCode", code);
    return;
};

const join = () => {
    const roomCodeInput = $('room-code');
    const roomCode = roomCodeInput.value;
    if(roomCode.length != 4) {
        throwError("Invalid Room Code!");
    }
};

window.onload = async () => {

    $('host-button').addEventListener('click', host);
    $('join-button').addEventListener('click', join);
};