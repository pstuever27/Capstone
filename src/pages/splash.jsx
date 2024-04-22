/**
 * Prolouge
 * File: Splash.jsx
 * Description: represents functionality for the input fields
 *              
 * Programmer(s): Nicholas Nguyen, Chinh Nguyen, Paul Stuever
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
 *  Revision: moved placement of code comment for one div to be correctly aligned
 *            readded logo fade-in animation for sprint submission
 * Date Revised: 11/17/2023 - Paul Stuever
 *  Revision: Refactored splash screen to allow for php integration and host/join flow
 * Date Revised: 2/24/2024 - Paul Stuever
 *  Revision: Added cookies for information passing
 * Date Revised: 3/09/2024 - Kieran Delaney
 *  Revision: Added session storage initialization for more secure skiplock mechanism
 * Date Revised: 4/05/2024 - Kieran Delaney
 *  Revision: Added session storage initialization for replayLock mechanism
 * Date Revised: 4/19/2024 - Nicholas Nguyen
 * 	Revision: Wrapped the entire container in another div to center the splash screen on mobile despite media queries
 * Date Revised: 4/21/2024 - Kieran Delaney
 * 	Revision: Added ability to paste the room code into the room code text field, and enter key listening for room code sync button
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
import clientAPI from '../clientAPI';
import Cookies from 'universal-cookie';
// import { useNavigate } from "react-router-dom";

function Splash()
{
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

    const [placeholderName, setPlaceHolderName] = useState( "What's your name?" );

    const [ hostJoinSuccess, setHostJoinSuccess ] = useState( false );
    
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

    // handle backspace, focus on previous input box
    const handleBackTrack = ( e, index ) => {
        // if not on the first box, go backward on focus
        if( e.keyCode === 8 && !e.target.value && index > 0 ) 
        {
            // focus onto the previous box
            boxRefs[ index - 1 ].current.focus();
        }
        else if ( e.key === 'Enter'){
            sync();
        }
    };

    // handle changing the name of the room or user
    const handleNameChange = (name) => {
        dispatch(setName(name.target.value)); // set the redux global to the name value
    }

    // handle clicking the "SYNC" button
    const sync = () => {
        // look at php response, and work accordingly
        if( !phpResponse ) {
            // prevent name entry on incomplete code entry
            if( roomCode.join("").length < 4 ) 
            {
                return;
            }
            makeRequest("join", roomCode.join(""));
            setHostJoinSuccess(true);
            return;
        }   
            
        if(hostCode) { // If a host code has been generated, then we're in host mode and we want to use host php files
            makeRequest("host-name", hostCode, username);
            return;
        }
        makeRequest("join-name", roomCode.join(""), username); //Otherwise, we want to just use join php files
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
        return code;
    };

    // Handle clicking the "host a room" button
    const host = () => {
        if( loginState ) { //loginState will be used to tell if the user is logged into spotify, it's a redux global.
            let tempCode = genCode();
            setHostCode(tempCode); //Generate a code and store it in the hostCode state
            makeRequest("host-code", tempCode, null); //Make php request
            setHostJoinSuccess(true); //Set the hostJoinSuccess state to true
        }
        else { //Doesn't get hit right now, after spotify integration it will be fixed.
            //Call spotify login flow and store necessary info there
        }
    }

    const refresh = () => {
        clientToken();
    }

    const handleFocus = () => {
        setPlaceHolderName( "" );
    }

    const handleBlur = () => {
        setPlaceHolderName( "What's your name?" );
    }
    
    // These are all redux globals. They are used to track important information between files. Works as sort of a database
    const { roomCode } = useSelector(state => state.roomCode);

    const { username } = useSelector(state => state.username);

    const { loginState } = useSelector(state => state.loginState);

    // Hook that grabs the makeRequest function and phpResponse state from phpAPI
    const { makeRequest, phpResponse } = phpAPI();

    const { clientAccess: clientToken } = clientAPI();

    const cookie = new Cookies();

    //added useeffect for allowing for being able to paste code into field rather than manually typing
    useEffect(() => {
        const pasteCode = (ev) => {
            if(!hostJoinSuccess){ //only on the enter room code screen
                ev.preventDefault();
                let pastedText = (ev.clipboardData || window.clipboardData).getData('text');

                pastedText = pastedText.toUpperCase();
                //remove any trailing spaces or other whitespace
                pastedText = pastedText.replace(/\s+/g, '');

                if(pastedText.length == 4 && regex.test( pastedText )){ //room codes are 4 characters long and meets our regex room code format requirements                    
                    //convert the string into an array for inputting into the placeholder on the screen
                    pastedText = pastedText.split(''); //pastedText is now of array type
                    // now that it's an array, we can set the global roomCode to this current code
                    dispatch(setCode(pastedText));
                    
                    //places each character into the fields on the screen
                    pastedText.map((char, index) => {
                        boxRefs[ index ].current.value = char;
                    })

                    //sets UI so show room code added and allow sync button to be pressed
                    setInputColor( prev => {
                        return inputColor.filter( item => item !== "tealBackground" && item !== "blackBackground" ).concat( "blackBackground" );
                    } );
                    setButtonColor( prev => {
                        return buttonColor.filter( item => item !== "tealText" && item !== "blackText" ).concat( "blackText" );
                    } );

                    boxRefs[3].current.focus(); //allows us to be able to hit enter key to run sync function, as the focus is on the input field so the onkeydown will run for that
                }
            }
        }

        document.addEventListener('paste', pasteCode);
      
        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('paste', pasteCode);
        };
    }, []) //empty dependency array so that this unmounts the event listener properly. tested it and we are able to paste again once we get into the homepage after typing your name and joining the room

    // Watches the phpResponse state and triggers when it's changed
    useEffect(() => {
        if (phpResponse) {
            // Case for good room code on join
            if (phpResponse.status == 'ok_join') {
                cookie.set('roomCode', roomCode.join(""), { path: '/' });
            }
            //Case for good room code generation on host 
            if (phpResponse.status == 'ok_host') {
                dispatch(setCode(hostCode));
            }
            //Error handling
            else if (phpResponse.status == 'error') {
                if (phpResponse.error == 'Bad host code!') {
                    // genCode();
                }
            }
            // Case for good name entry on join
            else if (phpResponse.status == "good_name") {
                cookie.set('username', username, { path: '/' });
                //"skipLock" session storage cookie is a boolean save state for ensuring that a user can only submit one vote towards skipping the current track. it is stored in cookies to ensure it won't be unlocked by refreshing the page
                sessionStorage.setItem('skipLock', 'unlocked'); //initializes skiplock to be unlocked when first entering site
                sessionStorage.setItem('replayLock', 'unlocked'); //initializes replayLock to be unlocked when first entering site
                navigate("/join"); // Navigate to join.jsx
                // navigate(path);
            }
            // Case for good name entry on host. Shouldn't fail unless there's server error
            else if (phpResponse.status == "good_host_name") {
                cookie.set('roomCode', roomCode, { path: '/' });
                cookie.set('username', username, { path: '/' });
                cookie.set('explicit', true, { path: '/' });
                cookie.set('shuffle', false, { path: '/' })
                cookie.set('fallback', true, { path: '/' })
                //"skipLock" session storage cookie is needed for host too for the majority vote mechanism (more details in comments of NowPlaying.jsx)
                sessionStorage.setItem('skipLock', 'unlocked'); //initializes skiplock to be unlocked when first entering site
                sessionStorage.setItem('replayLock', 'unlocked'); //initializes replayLock to be unlocked when first entering site
                navigate("/host"); // Navigate to host.jsx
            }
        }
    }, [phpResponse])

    // Finally, this component will return divs with all the necessary inputs and buttons
    return (
        // contains all the elements on the page
				<div id = "center-splash">
					<div id = "main-container">
							{/*Contains the name entry text field*/}
							
							{ hostJoinSuccess ? 
									(<div id = "hidden-name" style={{opacity: 1}}>
											<input type="text" 
													className="name-input"
													minLength={3}
													// placeholder="What's your name?"
													placeholder = { placeholderName }
													onFocus = { handleFocus }
													onBlur = { handleBlur}
													// allows user to press enter to submit name
													onKeyDown={ e => { if ( e.key === "Enter" ) { sync() } } }
													onChange={ e => handleNameChange( e ) }/><b id = "hand" onClick={ sync }>&#9758;</b>
									</div> )

							: 
							
							(
									<div id = "welcome">
											{/* container holds the input boxes to collect user input */}
											<div id="code-input-container">
													{/* code.map "lays out" the input fields for our code input.
													think of it like rendering each code input box */}
													{placeholderCode.map((code_char, index) => (
															<input
																	className={inputColor.join(" ")}
																	type="text"
																	maxLength="1"
																	key={index}
																	placeholder={placeholderCode[index]}
																	ref={boxRefs[index]}
																	onChange={e => handleCodeChange(e, index)}
																	onKeyDown={e => handleBackTrack(e, index)}
															/>
													))}
											</div>
											
											<button 
													className={buttonColor.join(" ")}
													onClick={sync} 
													id="sync-button"
											>SYNC</button>
					
											{/* Contains the 'host a room' button
													On clicking this, a roomCode will be generated and name input will be requested.
													Finally, the information will be stored in the mySQL server */}
											<div id="host-button-container">
													<button
															className="tealText"
															onClick={host}
															id="host-button"
													>Host a Room</button>
											</div>
									</div>
							)}

									
					</div>
				</div>	
    );
}

// Export the component
export default Splash;