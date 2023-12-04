/**
 * Prolouge
 * File: Splash.jsx
 * Description: represents functionality for the input fields
 *              
 * Programmer(s): Nicholas Nguyen, Chinh Nguyen
 * Date Created: 11/1/2023
 * 
 * Date Revised: 11/1/2023 - Nicholas Nguyen
 *  Revision: created input boxes and handling for input change. created base for splash react components
 * Date Revised: 11/2/2023 - Chinh Nguyen
 *  Revision: Added fade out effect once user finishes input
 * Date Revised: 11/2/2023 - Nicholas Nguyen
 *  Revision: added functionality to allow previous input boxes to be focused on once backspace is pressed
 *            added placeholder text in the input boxes
 *            removed logo fade-in animation/most of chinh's changes to allow room for backend functionality
 * Date Revised: 11/5/2023 - Chinh Nguyen
 *            moved placement of code comment for one div to be correctly aligned
 *            readded logo fade-in animation for sprint submission
 * Date Revised: 11/17/2023 - Paul Stuever - Refactored splash screen to allow for php integration and host/join flow
 * 
 * Preconditions: 
 *  @inputs : None 
 * Postconditions:
 *  @returns : 
 * Error conditions: None
 * Side effects: None
 * Invariants: None
 * Known Faults: CSS and displaying information needs to be updated to look better
 * **/

import React, { useState, useRef, useEffect } from 'react';
import phpAPI from '../phpApi';
import { useSelector, useDispatch } from 'react-redux';
import { setCode } from '../redux/roomCodeSlice'
import { setName } from '../redux/usernameSlice';
import { useNavigate } from 'react-router-dom';
import clientAPI from '../spotifyApi';
// import { useNavigate } from "react-router-dom";

function Splash()
{
    
    // array destructuring: const [ code, setCode ]
    //  code is the current value of the state
    //  setCode is a function that updates the value of code
    //  when called
    //
    // useState() initializes the state with an array 
    //  of four empty strings
    //
    // This will be modified within later parts of the app
    //  to collect the code input from the user 

    // colorFill is the current value of the state
    // setColor is a function that updates the value of colorFill when called
    // useState initializes the state with the default background color
    //  for input elements
    // this will be modified when all codes are filled in
    //  input elements will turn black instead of a darkened teal
    // const [ colorFill, setColor ] = useState( "teal" );

    // inputColor is the current array of class names. 
    // setInputColor changes the value of inputColor/changes the array of class names
    const [ inputColor, setInputColor ] = useState( ["code-input", "tealBackground"] );

    // buttonColor is the current array of class names. 
    // setButtonColor changes the value of button color/changes the array of class names
    const [ buttonColor, setButtonColor ] = useState( ["sync-button", "tealText"] );

    // placeholderCode is the placeholder used in the input boxes
    // setPlaceHolderCode sets the placeholder text to "SONG" if the input boxes
    //  are completely empty
    const [placeholderCode, setPlaceHolderCode] = useState(['S', 'O', 'N', 'G']);
    
    const [hostCode, setHostCode] = useState("");

    // boxRefs uses useRef to focus the next input after each input 
    const boxRefs = [ useRef( null ), useRef( null ), useRef( null ), useRef( null ) ];


    // global variable, used to make sure user input is valid
    const regex = /^[A-Za-z0-9]+$/;

    //dispatch is used to get globals from redux, will use later
    const dispatch = useDispatch();

    //navigate is used to go between components using react router
    const navigate = useNavigate();

    // const navigate = useNavigate();
    // e is the event object
        //  in our case, the event is a change in input
        // index is the position of the input within the array
    const handleCodeChange = ( e, index ) => {
        // input validation
        //
        // the first condition e.target.value.length <= 1
        //  makes sure that each input only has one char in it
        //
        // the second condition regex.test( e.target.value )
        //  makes sure that the input follows the regular expression for
        //  capital letters and numbers
        if( e.target.value == "" || e.target.value.length === 1 && regex.test( e.target.value ) )
        {
            // create a copy of the current state, code
            const codeCopy = [ ...roomCode ]; // use ... to avoid directly modifying the state 
           
            // sets the value for the state copy at the equivalent index to 
            //  the value in the input field (but in uppercase, in case
            //  the input is in lowercase)
            codeCopy[ index ] = e.target.value.toUpperCase();

            // Set the global roomCode to the current code
            dispatch(setCode(codeCopy));

            // if the code is not completely empty, remove placeholder text in input boxes
            if( codeCopy.join() != "" )
            {
                setPlaceHolderCode( [ '', '', '', '' ] );
            }

            // change the input elements to solid black if 
            // all input boxes are filled
            // only runs if code state does not contain undefined, "", or null
            // check codeCopy becuase state stuff is asynchronous
            if( !codeCopy.includes( "" ) )
            {
                // set input box background to black
                setInputColor( prev => {
                    return inputColor.filter( item => item !== "tealBackground" && item !== "blackBackground" ).concat( "blackBackground" );
                } );

                // set sync button text to black
                setButtonColor( prev => {
                    return buttonColor.filter( item => item !== "tealText" && item !== "blackText" ).concat( "blackText" );
                } );
                console.log( "black" );
            }

            else
            {
                // sets the input box background color back to teal
                setInputColor( prev => {
                    return inputColor.filter( item => item !== "tealBackground" && item !== "blackBackground" ).concat( "tealBackground" );
                } );

                // sets the button color text back to teal
                setButtonColor( prev => {
                    return buttonColor.filter( item => item !== "tealText" && item !== "blackText" ).concat( "tealText" );
                } );
                console.log( "teal" );
            }

            // handle focus advancement of input boxes once a valid input is given
            // if there is a value and the current index is not the last index, advance.
            if ( e.target.value && index < 3 ) 
            {
                // focus onto the next box
                boxRefs[ index + 1 ].current.focus();
            }

            // otherwise, unfocus/blur() if there is a value and the current index IS the last index.
            else if( e.target.value && index == 3 )
            {
                // remove focus on the last box after input
                boxRefs[ index ].current.blur();
            }
        }
        
    };

    //Const function to fade out html elements for host/join flow
    const fadeOut = () => {
        // this block of code is for the fade out effect
        setTimeout(() => {
            const mainContainer = document.getElementById("main-container"); // get the main container
            let opacity = 1; // set the opacity to 1
            const intervalId = setInterval(() => { // set an interval to run every 9 milliseconds
                opacity -= 0.01; // decrease the opacity by 0.01
                if(mainContainer) {
                    mainContainer.style.opacity = opacity; // set the opacity of the main container to the new opacity
                }
                if (opacity <= 0) { // if the opacity is less than or equal to 0
                    clearInterval(intervalId); // clear the interval
                    const inputContainer = document.getElementById("code-input-container"); // get the main container
                    if(inputContainer){
                    inputContainer.style.display = "none"; // set the background color to black
                    mainContainer.style.opacity = 1; // set the opacity to 1
                    }
                    const hostContainer = document.getElementById("host-button-container"); // get the host button
                    hostContainer.style.display = "none"; // Hide the host container when we're fading out

                    // This block of code handles the fade in effect of logo!
                    setTimeout(() => {
                        const hiddenName = document.getElementById("hidden-name"); // get the main container
                        hiddenName.style.display = "block"; // show the name box
                        const button = document.getElementById("sync-button");
                        button.style.left = "125%";
                        hiddenName.style.zIndex = 2; // set the z-index to 1
                        let opacity = 0; // variable to hold the opacity
                        const intervalId = setInterval(() => { // set an interval to run every x milliseconds
                            opacity += 0.01; // increase the opacity by 0.01
                            hiddenName.style.opacity = opacity; // set the opacity of the logo to new opacity
                            button.style.opacity = opacity;
                            if (opacity >= 1) { // if the opacity is greater than or equal to 1
                                clearInterval(intervalId); // clear the interval
                            }
                        }, 12); // milliseconds per update FOR LOGO FADE IN
                    }, 50); // milliseconds before fade out FOR LOGO FADE IN

                }
            }, 9); // milliseconds per update FOR MAIN CONTAINER FADE OUT
        }, 350); // milliseconds before fade out FOR MAIN CONTAINER FADE OUT
    }

    // handle backspace, focus on previous input box
    const handleBackTrack = ( e, index ) => {
        // if not on the first box, go backward on focus
        if( e.keyCode === 8 && !e.target.value && index > 0 ) 
        {
            // focus onto the previous box
            boxRefs[ index - 1 ].current.focus();
        }
    };

    // handle changing the name of the room or user
    const handleNameChange = (name) => {
        dispatch(setName(name.target.value)); // set the redux global to the name value
    }

    // handle clicking the "SYNC" button
    const sync = () => {
        // look at php response, and work accordingly
        if (!phpResponse || phpResponse.error == "Room Doesn't Exist!") {
            makeRequest("join", roomCode.join(""), null);
        }
        else {
            if(hostCode) { // If a host code has been generated, then we're in host mode and we want to use host php files
                makeRequest("host-name", hostCode, username);
                return;
            }
            makeRequest("join-name", roomCode, username); //Otherwise, we want to just use join php files
        }
    };

    //Generate a roomcode by random 
    const genCode = () => {
        // Game Code Generation ~~~~~~~~
        //We have opted to only use uppercase letters and numbers
        const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
        var code = '';
        //Random choose loop
        for (var i = 0; i < 4; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        console.log(code); //Console log for dev purposes
        return code;
    };

    // Handle clicking the "host a room" button
    const host = () => {
        if( loginState ) { //loginState will be used to tell if the user is logged into spotify, it's a redux global.
            let tempCode = genCode();
            setHostCode(tempCode); //Generate a code and store it in the hostCode state
            makeRequest("host-code", tempCode, null); //Make php request
        }
        else { //Doesn't get hit right now, after spotify integration it will be fixed.
            console.log("Doing spotify login flow...");
            //Call spotify login flow and store necessary info there
        }
    }

    const refresh = () => {
        clientToken();
    }

    // These are all redux globals. They are used to track important information between files. Works as sort of a database
    const { roomCode } = useSelector(state => state.roomCode);

    const { username } = useSelector(state => state.username);

    const { loginState } = useSelector(state => state.loginState);

    // Hook that grabs the makeRequest function and phpResponse state from phpAPI
    const { makeRequest, phpResponse } = phpAPI();

    const { makeRequest: clientToken } = clientAPI();

    // Watches the phpResponse state and triggers when it's changed
    useEffect(() => {
        if (phpResponse) {
            // Case for good room code on join
            if (phpResponse.status == 'ok_join') {
                console.log("good!");
                fadeOut();
            }
            //Case for good room code generation on host 
            if (phpResponse.status == 'ok_host') {
                console.log("good host!");
                dispatch(setCode(hostCode));
                fadeOut();
            }
            //Error handling
            else if (phpResponse.status == 'error') {
                console.log(phpResponse.error); // This will need to be replaced with front-end error box
                if (phpResponse.error == 'Bad host code!') {
                    // genCode();
                }
            }
            // Case for good name entry on join
            else if (phpResponse.status == "good_name") {
                console.log("moving on!");
                navigate("/join"); // Navigate to join.jsx
                // navigate(path);
            }
            // Case for good name entry on host. Shouldn't fail unless there's server error
            else if (phpResponse.status == "good_host_name") {
                console.log("Host good!");
                navigate("/host"); // Navigate to host.jsx
            }
        }
    }, [phpResponse])

    // Finally, this component will return divs with all the necessary inputs and buttons
    return (
        // contains all the elements on the page
        <div id = "main-container">
            {/*Contains the name entry text field*/}
            <div id = "hidden-name" style={{opacity: 0}}>
                <input type="text" 
                    className="name-input"
                    minLength={3}
                    placeholder="Name"
                    onChange={ e => handleNameChange( e ) }/>
            </div>

            {/* container holds the input boxes
            to collect user input */}
            <div id = "code-input-container">
                {/* code.map "lays out" the input fields
                 for our code input.
                 think of it like rendering each code input box */}
                { placeholderCode.map( ( code_char, index ) => (
                        <input
                            // allows dynamic className, inputColor will be either 
                            //  "code-input teal"
                            //  or "code-input black"
                            className = { inputColor.join( " " ) }
                            type = "text"
                            maxLength = "1"
                            key = { index }
                            placeholder = { placeholderCode[ index ] }

                            // boxRefs attached to inputs
                            ref = { boxRefs[ index ] } 

                            // when the input changes, run the handleCodeChange()
                            //  function
                            onChange = { e => handleCodeChange( e, index ) }

                            // handle backspace
                            onKeyDown = { e => handleBackTrack( e, index ) }
                        />
                    ) ) }
            </div>
            {/* when pressed, run the sync() function */}
            <button 
                // allows dynamic className, buttonColor will be either 
                //  "sync-button teal"
                //  or "sync-button black"
                className = { buttonColor.join( " " ) }
                onClick={ sync } 
                id = "sync-button"
            >SYNC</button>
            {/*Contains the 'host a room' button
                On clicking this, a roomCode will be generated and name input will be requested.
                Finally, the information will be stored in the mySQL server*/}
            <div id="host-button-container">
                    <button
                        className = "tealText"
                        onClick = { host }
                        id = "host-button"
                    >Host a Room</button>
            </div>
            <button onClick= { refresh }>Test</button>
        </div>
    );
}

// Export the component
export default Splash;