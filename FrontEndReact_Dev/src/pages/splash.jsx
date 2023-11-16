/**
 * Prolouge
 * File: Splash.js
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
 * 
 * Preconditions: 
 *  @inputs : None 
 * Postconditions:
 *  @returns : 
 * Error conditions: None
 * Side effects: None
 * Invariants: None
 * Known Faults: must integrate PHP backend
 * **/

import React, { useState, useRef, useEffect } from 'react';
import phpAPI from '../phpApi';
import { useSelector, useDispatch } from 'react-redux';
import { setCode } from '../redux/roomCodeSlice'
import { setName } from '../redux/usernameSlice';
import { setLoading } from '../redux/loadingSlice';
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
    
    const [phpAddress, setPhpAddress] = useState("join");

    // boxRefs uses useRef to focus the next input after each input 
    const boxRefs = [ useRef( null ), useRef( null ), useRef( null ), useRef( null ) ];


    // global variable, used to make sure user input is valid
    const regex = /^[A-Za-z0-9]+$/;

    // e is the event object
    //  in our case, the event is a change in input
    // index is the position of the input within the array
    const dispatch = useDispatch();

    // const navigate = useNavigate();

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

            // call the set code function with the modified copy of the 
            //  code.
            // this will allow the code object to have the values of 
            //  codeCopy
            
            dispatch(setCode(codeCopy));

            // if the code is not completely empty, remove placeholder text in input boxes
            if( codeCopy.join() != "" )
            {
                console.log( "butthole 1" );
                setPlaceHolderCode( [ '', '', '', '' ] );
            }
            if( codeCopy.join().length >= 4 && !codeCopy.includes(',')) 
            {
                console.log("hey");
                // //If less than 4, then code isn't completely input
                // makeRequest();
                // if(phpResponse) {
                //     if(phpResponse.status == 'ok') {
                //         console.log("good!");
                //     }
                //     else {
                //         console.log("invalid roomcode! (make error box)");
                //     }
                // }

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

    const fadeOut = () => {
        // this block of code is for the fade out effect
        setTimeout(() => {
            const mainContainer = document.getElementById("main-container"); // get the main container
            let opacity = 1; // set the opacity to 1
            const intervalId = setInterval(() => { // set an interval to run every 9 milliseconds
                opacity -= 0.01; // decrease the opacity by 0.01
                mainContainer.style.opacity = opacity; // set the opacity of the main container to the new opacity
                if (opacity <= 0) { // if the opacity is less than or equal to 0
                    clearInterval(intervalId); // clear the interval
                    const inputContainer = document.getElementById("code-input-container"); // get the main container
                    inputContainer.style.display = "none"; // set the background color to black
                    mainContainer.style.opacity = 1; // set the opacity to 1

                    // This block of code handles the fade in effect of logo!
                    setTimeout(() => {
                        const hiddenName = document.getElementById("hidden-name"); // get the main container
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
                        setPhpAddress("join-name");
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

    const handleNameChange = (name) => {
        console.log(name.target.value);
        dispatch(setName(name.target.value));

    }

    const sync = () => {
        if (!phpResponse || phpResponse.error == "Room Doesn't Exist!") {
            makeRequest();
        }
        else {
            makeRequest();
        }
    };

    const { roomCode } = useSelector(state => state.roomCode);

    const { username } = useSelector(state => state.username);

    const { makeRequest, phpResponse } = phpAPI( phpAddress, roomCode.join(""), username);
    
    useEffect(() => {
        if (phpResponse) {
            if (phpResponse.status == 'ok') {
                console.log("good!");
                fadeOut();
            }
            else if(phpResponse.status == 'error'){
                console.log(phpResponse.error);
            }
            else if (phpResponse.status == "good_name") {
                console.log("moving on!");
                dispatch(setLoading(true));
                // navigate(path);
            }
        }
    }, [phpResponse])

    console.log(roomCode);

    return (
        // contains all the elements on the page
        <div id = "main-container">
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
                { roomCode.map( ( code_char, index ) => (
                        <input
                            // allows dynamic className, inputColor will be either 
                            //  "code-input teal"
                            //  or "code-input black"
                            className = { inputColor.join( " " ) }
                            type = "text"
                            maxLength = "1"
                            key = { index }
                            value = { code_char } 
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
        </div>
    );
}

export default Splash;