#--------------------------------
# File: akiqueue.py
# Description: Python script that generates a Flask webapp. This is a demo that lets a user login to their spotify account and then view their profile or playlist data directly from Spotify API in json format. This is a proof of concept and will be expanded upon in future revisions.
# Programmer(s): Chinh Nguyen
# Created on: 9/20/2023
# Revised on: 10/4/2023
# Revision: Chinh added CORS to allow cross-origin requests from React frontend
# Preconditions: CLIENT_ID and CLIENT_SECRET must be inputted into the code. The user must have a Spotify account and be logged in to use the demo. The user must have a Spotify developer account and have a registered app with the CLIENT_ID and CLIENT_SECRET. The user must have a Spotify premium account to use the demo.
# Postconditions: No known postconditions
# Error conditions: No known error conditions
# Side effects: No known side effects
# Invariants: No known invariants
# Faults: No known faults
#--------------------------------

# Necessary imports
from flask import Flask, redirect, request, session, url_for, jsonify, render_template # Importing Flask and other libraries
import json # Importing json library
import requests # Importing requests library
import os # Importing os library
from flask_cors import CORS # Importing CORS library

# Creating Flask app
app = Flask(__name__) # Creating Flask app
CORS(app)  # Enabling CORS

# load config file
with open('config.json') as f: # opening config file
    config = json.load(f) # loading config file into config variable

# Spotify app credentials
CLIENT_ID = config['client_id'] # Spotify client id
CLIENT_SECRET = config['client_secret'] # Spotify client secret
REDIRECT_URI = 'http://localhost:5000/callback' # Spotify redirect uri
SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1" # Spotify API base url

# helper function to get track details
def get_track_details(track_uri):
    headers = { # headers for Spotify API
        "Authorization": f"Bearer {session['access_token']}" # access token for Spotify API
    }
    track_id = track_uri.split(':')[-1] # getting track id from track uri
    response = requests.get(f"{SPOTIFY_API_BASE_URL}/tracks/{track_id}", headers=headers) # getting track details from Spotify API
    if response.status_code != 200: # if response is not 200, return None
        return None # return None
    track_data = response.json() # getting track data from response
    return track_data # return track data

def extract_track_uri(spotify_url): # helper function to extract track uri from Spotify url
    track_id = spotify_url.split('/')[-1] # getting track id from Spotify url
    return f"spotify:track:{track_id}" # returning track uri

# random secret key
app.secret_key = os.urandom(24) # generating random secret key

# route for home page
@app.route('/') # route for home page
def index(): # index function
    """Render the HTML page with form.""" # description of function
    return render_template("template.html") # rendering template.html

# route for profile page
@app.route('/login') # route for login page
def login(): # login function
    """Return the Spotify login URL.""" # description of function
    auth_url = f"https://accounts.spotify.com/authorize?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=user-modify-playback-state" # Spotify authorization url
    return jsonify({"url": auth_url}) # returning authorization url

# route for callback page
@app.route('/callback') # route for callback page
def callback(): # callback function
    """Exchange code for access token.""" # description of function
    code = request.args['code'] # getting code from request
    token_url = "https://accounts.spotify.com/api/token" # Spotify token url
    token_data = { # token data for Spotify API
        "grant_type": "authorization_code", # authorization code
        "code": code, # code
        "redirect_uri": REDIRECT_URI, # redirect uri
        "client_id": CLIENT_ID, # client id
        "client_secret": CLIENT_SECRET # client secret
    }
    response = requests.post(token_url, data=token_data) # getting response from Spotify API
    token_info = response.json() # getting token info from response
    session["access_token"] = token_info["access_token"] # setting access token in session 
    session['song_history'] = [] # setting song history in session
    
    # Redirect to React frontend after handling the token
    react_app_url = 'http://localhost:3000'  # URL of React frontend
    return redirect(react_app_url) # redirecting to React frontend

@app.route('/add_song', methods=['POST']) # route for add song page
def add_song(): # add song function 
    if not session.get('access_token'): # if access token is not in session
        return jsonify({"message": "Missing access token. Please login again.", "song_detail": ""}) # return error message
 
    track_uri = extract_track_uri(request.form.get('track_uri')) # getting track uri from request
    
    headers = { # headers for Spotify API
        "Authorization": f"Bearer {session['access_token']}" # access token for Spotify API
    }

    response = requests.post(f"{SPOTIFY_API_BASE_URL}/me/player/queue?uri={track_uri}", headers=headers) # adding track to queue in Spotify API
    
    if response.status_code == 204: # handling status code 204
        track_details = get_track_details(track_uri) # getting track details

        # this block of code is to display the song details in the frontend
        if track_details: # if track details is not None
            artist_name = track_details['artists'][0]['name'] # getting artist name from track details
            song_name = track_details['name'] # getting song name from track details
            display_text = f"{artist_name} - {song_name}" # setting display text
            session['song_history'].append(display_text) # appending display text to song history
        # if track details is None, display the track uri instead
        else:
            display_text = track_uri # setting display text
            session['song_history'].append(display_text) # appending display text to song history

        # returning success message and song details
        return jsonify({"message": "Track added to queue successfully.", "song_detail": display_text})
    # handling other status codes
    else:
        return jsonify({"message": f"Failed to add track. Response: {response.text}", "song_detail": ""}) # returning error message

# route for song history page
if __name__ == '__main__':
    app.run(debug=True)
