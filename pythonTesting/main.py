#--------------------------------
# File: main.py
# Description: Python script that generates a Flask webapp. This is a demo that lets a user login to their spotify account and then view their profile or playlist data directly from Spotify API in json format. This is a proof of concept and will be expanded upon in future revisions.
# Programmer(s): Kieran Delaney, Chinh Nguyen
# Created on: 9/20/2023
# Revised on: 9/22/2023
# Revision: Chinh added the config file to store the Spotify app client secret
# Preconditions: Must have valid CLIENT_ID and CLIENT_SECRET from spotify app to function. No input values or types from user, since the input is passed through Spotify's login API webpage
# Postconditions: Return value of app is a json text string, returned to the webpage
# Error conditions: Errors from callback of Spotify API are displayed on webpage in a json text blurb for all request arguments
# Side effects: No known side effects
# Invariants: One invariant of this demo is the "Show dialog" parameter of the login function being set to true. This makes it so that the site will always ask for authentication from spotify
# Faults: No known faults, apart from the errors that show if CLIENT_ID and CLIENT_SECRET aren't inputted into the code
#--------------------------------

# IMPORTS: Necessary libraries and modules needed for the app to run correctly
import requests # importing the requests module for the http requests
import urllib.parse # importing the urllib.parse module for the url encoding
import json # importing the json module for the config.json file
from datetime import datetime, timedelta # importing datetime and timedelta modules for refresh token
from flask import Flask, redirect, redirect, request, jsonify, session # importing flask and other dependencies which is used to create the web app


# CONFIG FILE: Load settings from a JSON configuration file named 'config.json'
with open('config.json') as f: # opening the config.json file
    config = json.load(f) # loading the config.json file into a variable


# FLASK SETUP: Initialize a Flask web application. This is the main entry point into the application
app = Flask(__name__) # creating the flask app
app.secret_key = 'fwjioewifejijoweffew' # arbitrary string


# SPOTIFY CREDENTIALS: Extracting the necessary credentials for Spotify API integration from the loaded configuration file
CLIENT_ID = config['client_id'] # client_id is the key in the config.json file
CLIENT_SECRET = config['client_secret'] # client_secret is the key in the config.json file


# SPOTIFY URLS: Define several constants that represent endpoints on the Spotify API.
REDIRECT_URI = 'http://localhost:5000/callback' # redirect_uri is how the user will be redirected after authenticating
AUTH_URL = 'https://accounts.spotify.com/authorize' # AUTH_URL is the url to authenticate the user
TOKEN_URL = 'https://accounts.spotify.com/api/token' # TOKEN_URL is the url to get the token
API_BASE_URL = 'https://api.spotify.com/v1/' # API_BASE_URL is the base url for the api


# ROUTE: Home route to welcome the user and provide a link to log in with Spotify.
@app.route('/') # route for the home page
def index(): # function for the home page
    return "<center style=\"margin-top:45vh;font-family:Gotham;font-size:50px;\">Welcome to SongSync <br><span style=\"font-size:25px\"><a href='login'>Login with Spotify</a></span></center>" # returning the html for the home page


# ROUTE: Login route which directs the user to the Spotify authentication page.
@app.route('/login') # route for the login page
def login(): # function for the login page
    params = { # params for the url
        'client_id': CLIENT_ID, # client id of the app
        'response_type': 'code', # response type. this is how the app will get the token
        'scope': 'user-read-private user-read-email', # this is the scope of the app. this is what the app can do with the user's account
        'redirect_uri': REDIRECT_URI, # url that the user will be redirected to after authenticating
        'show_dialog': True # comment out this before going to prod. this is just to force authentication requests each time for testing
    }
    auth_url = f"{AUTH_URL}?{urllib.parse.urlencode(params)}" # url that the user will be redirected to
    return redirect(auth_url) # redirect the user to the url


# ROUTE: Callback route that Spotify will redirect the user to after successful authentication.
@app.route('/callback') # route for the callback page
def callback(): # function for the callback page
    if 'error' in request.args: # check if there is an error in the url
        return jsonify({"error": request.args['error']}) # return the error in json format
    if 'code' in request.args: # check if there is a code in the url
        req_body = { # body of the request
            'code': request.args['code'], # the code that the app will use to get the token
            'grant_type': 'authorization_code', # grant type. this is how the app will get the token
            'redirect_uri': REDIRECT_URI, # url that the user will be redirected to after authenticating
            'client_id': CLIENT_ID, # client id of the app
            'client_secret': CLIENT_SECRET # client secret of the app
        }
        response = requests.post(TOKEN_URL, data=req_body) # sending the request to the token url
        token_info = response.json() # getting the token info
        session['access_token'] = token_info['access_token'] # storing the access token in the session
        session['refresh_token'] = token_info['refresh_token'] # storing the refresh token in the session
        session['expires_at'] = datetime.now().timestamp() + token_info['expires_in'] # storing the expiration time in the session
        return "<center style=\"margin-top:50vh;font-family:Gotham;font-size:50px;\">View your <a href='profile'>Profile</a> or <a href='playlists'>Playlists</a></center>" # returning the html for the callback page


# ROUTE: Profile route to fetch and display user's profile details from Spotify.
@app.route('/profile') # route for the profile page
def get_profile(): # function for the profile page
    if 'access_token' not in session: # check if the access token is in the session
        return redirect('/login')  # redirect to the login page if the access token is not in the session
    if datetime.now().timestamp() > session['expires_at']: # check if the expiration time is greater than the current time
        return redirect('/refresh-token') # redirect to the refresh token page if the expiration time is greater than the current time
    headers = { # headers for the request
        'Authorization': f"Bearer {session['access_token']}" # authorization header
    }
    response = requests.get(API_BASE_URL + 'me', headers=headers) # sending the request to the api
    profile = response.json() # getting the profile info
    return jsonify(profile) # returning the profile info in json format


# ROUTE: Playlists route to fetch and display user's playlists from Spotify.
@app.route('/playlists') # route for the playlists page
def get_playlists(): # function for the playlists page
    if 'access_token' not in session: # check if the access token is in the session
        return redirect('/login') # redirect to the login page if the access token is not in the session
    if datetime.now().timestamp() > session['expires_at']: # check if the expiration time is greater than the current time
        return redirect('/refresh-token') # redirect to the refresh token page if the expiration time is greater than the current time
    headers = { # headers for the request
        'Authorization': f"Bearer {session['access_token']}" # authorization header
    }
    response = requests.get(API_BASE_URL + 'me/playlists', headers=headers) # sending the request to the api
    playlists = response.json() # getting the playlists info
    return jsonify(playlists) # returning the playlists info in json format


# ROUTE: Refresh the session's access token using the refresh token when it expires.
@app.route('/refresh-token') # route for the refresh token page
def refresh_token(): # function for the refresh token page
    if 'refresh_token' not in session: # check if the refresh token is in the session
        return redirect('/login') # redirect to the login page if the refresh token is not in the session
    if datetime.now().timestamp() > session['expires_at']: # check if the expiration time is greater than the current time
        req_body = { # body of the request
            'grant_type': 'refresh_token', # grant type. this is how the app will get the token
            'refresh_token': session['refresh_token'], # refresh token of the app
            'client_id': CLIENT_ID, # client id of the app
            'client_secret': CLIENT_SECRET # client secret of the app
        }
        response = requests.post(TOKEN_URL, data=req_body) # sending the request to the token url
        new_token_info = response.json() # getting the new token info
        session['access_token'] = new_token_info['access_token'] # storing the new access token in the session
        session['expires_at'] = datetime.now().timestamp() + new_token_info['expires_in'] # storing the new expiration time in the session
        return "<center style=\"margin-top:50vh;font-family:Gotham;font-size:50px;\">View your <a href='profile'>Profile</a> or <a href='playlists'>Playlists</a></center>" # returning the html for the refresh token page


# MAIN EXECUTION: Starts the Flask web application if this script is run directly.
if __name__ == '__main__': # python main function
    app.run(host='0.0.0.0', debug=True) # this is to run the app on the local host
