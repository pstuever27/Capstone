import requests
import urllib.parse
import json
from datetime import datetime, timedelta
from flask import Flask, redirect, redirect, request, jsonify, session

# This block of code serves to open config.json 
with open('config.json') as f: # opening the config.json file
    config = json.load(f) # loading the config.json file into a variable

app = Flask(__name__) # creating the flask app
app.secret_key = 'fwjioewifejijoweffew' # arbitrary string

# This block of code is to get the client_id and client_secret from the config.json file
CLIENT_ID = config['client_id'] # client_id is the key in the config.json file
CLIENT_SECRET = config['client_secret'] # client_secret is the key in the config.json file

# This block of code is to handle the URI and URLs for the Spotify API
REDIRECT_URI = 'http://localhost:5000/callback' # redirect_uri is how the user will be redirected after authenticating
AUTH_URL = 'https://accounts.spotify.com/authorize' # AUTH_URL is the url to authenticate the user
TOKEN_URL = 'https://accounts.spotify.com/api/token' # TOKEN_URL is the url to get the token
API_BASE_URL = 'https://api.spotify.com/v1/' # API_BASE_URL is the base url for the api

@app.route('/')
def index():
    return "<center style=\"margin-top:45vh;font-family:Gotham;font-size:50px;\">Welcome to SongSync <br><span style=\"font-size:25px\"><a href='login'>Login with Spotify</a></span></center>"

@app.route('/login')
def login():
    params = {
        'client_id': CLIENT_ID,
        'response_type': 'code',
        'scope': 'user-read-private user-read-email',
        'redirect_uri': REDIRECT_URI,
        'show_dialog': True #comment out this before going to prod. this is just to force authentication requests each time for testing
    }
    auth_url = f"{AUTH_URL}?{urllib.parse.urlencode(params)}"
    return redirect(auth_url)

@app.route('/callback')
def callback():
    if 'error' in request.args:
        return jsonify({"error": request.args['error']})
    if 'code' in request.args:
        req_body = {
            'code': request.args['code'],
            'grant_type': 'authorization_code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
        }
        response = requests.post(TOKEN_URL, data=req_body)
        token_info = response.json()
        session['access_token'] = token_info['access_token']
        session['refresh_token'] = token_info['refresh_token']
        session['expires_at'] = datetime.now().timestamp() + token_info['expires_in']
        return "<center style=\"margin-top:50vh;font-family:Gotham;font-size:50px;\">View your <a href='profile'>Profile</a> or <a href='playlists'>Playlists</a></center>"
    
@app.route('/profile')
def get_profile():
    if 'access_token' not in session:
        return redirect('/login')
    if datetime.now().timestamp() > session['expires_at']:
        return redirect('/refresh-token')
    headers = {
        'Authorization': f"Bearer {session['access_token']}"
    }
    response = requests.get(API_BASE_URL + 'me', headers=headers)
    profile = response.json()
    return jsonify(profile)

@app.route('/playlists')
def get_playlists():
    if 'access_token' not in session:
        return redirect('/login')
    if datetime.now().timestamp() > session['expires_at']:
        return redirect('/refresh-token')
    headers = {
        'Authorization': f"Bearer {session['access_token']}"
    }
    response = requests.get(API_BASE_URL + 'me/playlists', headers=headers)
    playlists = response.json()
    return jsonify(playlists)

@app.route('/refresh-token')
def refresh_token():
    if 'refresh_token' not in session:
        return redirect('/login')
    if datetime.now().timestamp() > session['expires_at']:
        req_body = {
            'grant_type': 'refresh_token',
            'refresh_token': session['refresh_token'],
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
        }
        response = requests.post(TOKEN_URL, data=req_body)
        new_token_info = response.json()
        session['access_token'] = new_token_info['access_token']
        session['expires_at'] = datetime.now().timestamp() + new_token_info['expires_in']
        return "<center style=\"margin-top:50vh;font-family:Gotham;font-size:50px;\">View your <a href='profile'>Profile</a> or <a href='playlists'>Playlists</a></center>"
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)