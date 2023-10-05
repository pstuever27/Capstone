import { useState, useEffect } from 'react'
import { useQueueState } from "rooks";
import './App.css'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useAPI } from './SpotifyAPI';

function App() {
  const [searchResults, setSearchRes] = useState([]);
  //spotify api call initizations 
  const { makeRequest: reqSearch } = useAPI('https://api.spotify.com/v1/search'); 
  //add more api things later, like const { makeRequest: reqPlay } = useAPI('https://api.spotify.com/v1/play'); 

  async function search(){
    if(inputVal.length==0){
      return;
    }
    reqSearch(`?q=${inputVal}&type=track`)
      .then(
        data => {
          if(!data.tracks){ //handle invalid searches
            return;
          }
          console.log(data);
          setSearchRes(data.tracks.items.map(item => `${item.name} - ${item.artists[0].name}`))
        }
      )
  }

  const [songChoice, setValue] = useState("");
  const [inputVal, setInputValue] = useState("");
  const [list, { enqueue, dequeue, peek }] = useQueueState([]);

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={'./src/assets/logo.png'} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="searchDiv">
      <h1 style={{textShadow:'1px 1px 2px black'}}>Search Bar Prototype</h1>
        <Autocomplete
          disablePortal
          autoHighlight
          noOptionsText={''}
          id="search-box-demo"
          value={songChoice}
          inputValue={inputVal}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
            search();
          }}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          options={searchResults}
          sx={{ width: 300,}}
          renderInput={(params) => <TextField {...params} label="Search Songs" />}
        />
        
        <button onClick={() => {enqueue(songChoice);setValue("")}} style={{left:500, float:'right',}}>Add to Queue</button>
        
      </div>
      <div className='qDiv'>
      <h1 style={{ margin: '20px', textShadow:'1px 1px 2px black' }}>Queue</h1>
            <div style={{
                display: 'flex',
                flexDirection: 'horizontal',
                width: '400px',
                height: '60px',
                fontSize: '20px',
                margin: '20px',
                borderTop: '2px solid green',
                borderBottom: '2px solid green'
            }}>
                {list.map((item) => {
                    return <div style={{
                        width: 'auto',
                        padding:'5px',
                        height: '30px',
                        background: '#1189bd',
                        borderRadius: '5px',
                        margin: '10px',
                        textAlign: 'center'
                    }}
                        key={item}>{item}</div>;
                })}
            </div>
            <button style={{
                margin: '20px',
                width: '200px',
                borderRadius: '5px'
            }}
                onClick={dequeue}>
                Remove
            </button>
            <p style={{
                color: '#000000',
                fontSize: '20px',
                margin: '20px'
            }}><span style={{fontSize:'15px',fontWeight:'bolder'}}>Up Next:</span>  {peek()}</p>
      </div>
      <p className="read-the-docs">
        Using React + Vite + MaterialUI
      </p>
    </>
  )
}

export default App
