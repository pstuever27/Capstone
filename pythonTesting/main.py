import requests
import urllib.parse
from datetime import datetime, timedelta
from flask import Flask, redirect, redirect, request, jsonify, session

app = Flask(__name__)
app.secret_key = 'fwjioewifejijoweffew' #arbitrary string

CLIENT_ID = '585ff571a79142129e95d7f13861c2ea'
CLIENT_SECRET = '7b230a6351344782a9255fe1767863d2'
REDIRECT_URI = 'http://localhost:5000/callback'

AUTH_URL = 'https://accounts.spotify.com/authorize'
TOKEN_URL = 'https://accounts.spotify.com/api/token'
API_BASE_URL = 'https://api.spotify.com/v1/'

@app.route('/')
def index():
    return "<center style=\"margin-top:50vh;font-family:Gotham;font-size:50px;\">Welcome to SongSync <br><span style=\"font-size:25px\"><a href='login'>Login with Spotify</a></span></center>"

@app.route('/login')
def login():
    params = {
        'client_id': CLIENT_ID,
        'response_type': 'code',
        'scope': 'user-read-private user-read-email',
        'redirect_uri': REDIRECT_URI,
        'show_dialog': True #comment out this line later. this is just to force authentication requests each time for testing
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