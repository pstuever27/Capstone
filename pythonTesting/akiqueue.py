from flask import Flask, redirect, request, session, url_for, render_template_string
from flask import jsonify
import json
import requests
import os

app = Flask(__name__)

# load config file
with open('config.json') as f:
    config = json.load(f)

# spotify app credentials
CLIENT_ID = config['client_id']
CLIENT_SECRET = config['client_secret']
REDIRECT_URI = 'http://localhost:5000/callback'
SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1"

def get_track_details(track_uri):
    headers = {
        "Authorization": f"Bearer {session['access_token']}"
    }
    track_id = track_uri.split(':')[-1]
    response = requests.get(f"{SPOTIFY_API_BASE_URL}/tracks/{track_id}", headers=headers)
    if response.status_code != 200:
        return None
    track_data = response.json()
    return track_data

def extract_track_uri(spotify_url):
    track_id = spotify_url.split('/')[-1]
    return f"spotify:track:{track_id}"

# random secret key
app.secret_key = os.urandom(24)

@app.route('/')
def index():
    """Render the HTML page with form."""
    return render_template_string(open("template.html").read())

@app.route('/login')
def login():
    """Redirect user to Spotify login."""
    auth_url = f"https://accounts.spotify.com/authorize?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=user-modify-playback-state"
    print("WHY WONT YOU WORK")
    print(auth_url)
    return redirect(auth_url)

@app.route('/callback')
def callback():
    """Exchange code for access token."""
    code = request.args['code']
    token_url = "https://accounts.spotify.com/api/token"
    token_data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET
    }
    response = requests.post(token_url, data=token_data)
    token_info = response.json()
    session["access_token"] = token_info["access_token"]
    session['song_history'] = [] 
    return redirect(url_for('index'))

@app.route('/add_song', methods=['POST'])
def add_song():
    if not session.get('access_token'):
        return jsonify({"message": "Missing access token. Please login again.", "song_detail": ""})

    track_uri = extract_track_uri(request.form.get('track_uri'))
    
    headers = {
        "Authorization": f"Bearer {session['access_token']}"
    }

    response = requests.post(f"{SPOTIFY_API_BASE_URL}/me/player/queue?uri={track_uri}", headers=headers)
    
    if response.status_code == 204:  
        track_details = get_track_details(track_uri)

        if track_details:
            artist_name = track_details['artists'][0]['name']
            song_name = track_details['name']
            display_text = f"{artist_name} - {song_name}"
            session['song_history'].append(display_text)
        else:
            display_text = track_uri
            session['song_history'].append(display_text)

        return jsonify({"message": "Track added to queue successfully.", "song_detail": display_text})
    else:
        return jsonify({"message": f"Failed to add track. Response: {response.text}", "song_detail": ""})


if __name__ == '__main__':
    app.run(debug=True)
