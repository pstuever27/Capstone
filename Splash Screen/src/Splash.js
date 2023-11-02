/**
 * Prolouge
 * File: Splash.js
 * Description: represents functionality for the input fields
 *              
 * Programmer(s): Nicholas Nguyen, Chinh Nguyen
 * Date Created: 11/1/2023
 * Date Revised: 11/1/2023 - Nicholas Nguyen
 *  Revision: 11/1/2023 - Began Splashscreen UI Integration
 * Date Revised: 11/2/2023 - Chinh Nguyen
 *  Revision: Added fade out effect once user finishes input
 * Preconditions: 
 *  @inputs : None
 * Postconditions:
 *  @returns : 
 * Error conditions: None
 * Side effects: None
 * Invariants: None
 * Known Faults: 
 * **/

import React, { useState, useRef } from 'react';

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
    const [ code, setCode ] = useState( [ '', '', '', '' ] );

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

    // boxRefs uses useRef to focus the next input after each input 
    const boxRefs = [ useRef( null ), useRef( null ), useRef( null ), useRef( null ) ];


    // e is the event object
    //  in our case, the event is a change in input
    // index is the position of the input within the array
    const handleGranularity = ( e, index ) => {
        // input validation
        //
        // the first condition e.target.value.length <= 1
        //  makes sure that each input only has one char in it
        //
        // the second condition /^[A-Z0-9]*$/.test( e.target.value )
        //  makes sure that the input follows the regular expression for
        //  capital letters and numbers
        const regex = /^[A-Za-z0-9]+$/;

        if( e.target.value.length <= 1 && regex.test( e.target.value ) )
        {
            // create a copy of the current state, code
            const codeCopy = [ ...code ]; // use ... to avoid directly modifying the state 
           
            // sets the value for the state copy at the equivalent index to 
            //  the value in the input field (but in uppercase, in case
            //  the input is in lowercase)
            codeCopy[ index ] = e.target.value.toUpperCase();

            // call the set code function with the modified copy of the 
            //  code.
            // this will allow the code object to have the values of 
            //  codeCopy
            setCode( codeCopy );

            // change the input elements to solid black if 
            // all input boxes are filled
            // only runs if code state does not contain undefined, "", or null
            // check codeCopy becuase state stuff is asynchronous
            if( !codeCopy.includes( "" ) )
            {
                // setColor( "black" ); // set to black
                setInputColor( prev => {
                    return inputColor.filter( item => item !== "tealBackground" && item !== "blackBackground" ).concat( "blackBackground" );
                } );
                setButtonColor( prev => {
                    return buttonColor.filter( item => item !== "tealText" && item !== "blackText" ).concat( "blackText" );
                } );
                console.log( "black" );

                // this block of code is for the fade out effect
                setTimeout(() => {
                    const mainContainer = document.getElementById("main-container"); // get the main container
                    let opacity = 1; // set the opacity to 1
                    const intervalId = setInterval(() => { // set an interval to run every 9 milliseconds
                        opacity -= 0.01; // decrease the opacity by 0.01
                        mainContainer.style.opacity = opacity; // set the opacity of the main container to the new opacity
                        if (opacity <= 0) { // if the opacity is less than or equal to 0
                            clearInterval(intervalId); // clear the interval
                        }
                    }, 9); // milliseconds per update
                }, 350); // milliseconds before fade out

                // do whatever else we need to do
            }

            else
            {
                // setColor( "teal" ); // return to default
                
                setInputColor( prev => {
                    return inputColor.filter( item => item !== "tealBackground" && item !== "blackBackground" ).concat( "tealBackground" );
                } );
                setButtonColor( prev => {
                    return buttonColor.filter( item => item !== "tealText" && item !== "blackText" ).concat( "tealText" );
                } );
                console.log( "teal" );
            }

            // if not on the last box, advance the focus
            if( e.target.value && index < 3 ) 
            {
                // focus onto the next box
                boxRefs[ index + 1 ].current.focus();
            }
        }
    };

    const sync = () => {
        console.log( code.join( '' ) );
    };

    return (
        // contains all the elements on the page
        <div id = "main-container">
            {/* container holds the input boxes
            to collect user input */}
            <div id = "input-container">
                {/* code.map "lays out" the input fields
                 for our code input.
                 think of it like rendering each code input box */}
                { code.map( ( code_char, index ) => (
                        <input
                            className = { inputColor.join( " " ) }
                            type = "text"
                            maxLength = "1"
                            key = { index }
                            value = { code_char } 

                            // boxRefs attached to inputs
                            ref = { boxRefs[ index ] } 

                            // when the input changes, run the handleGranularity()
                            //  function
                            onChange = { e => handleGranularity( e, index ) }
                            
                        />
                    ) ) }
            </div>

            {/* when pressed, run the sync() function */}
            <button 
                className = { buttonColor.join( " " ) }
                onClick={ sync } 
            >SYNC</button>
        </div>
    );
}

export default Splash;