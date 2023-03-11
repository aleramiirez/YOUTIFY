import React, { useState, useEffect } from 'react';
import SpotifyWebApi from './spotify-web-api-js';
//import SpotifyLoginCheck from "./SpotifyLoginCheck";
import './App.css';
import YouTubeSearch from './YoutubeSearch';


const spotifyApi = new SpotifyWebApi();

function App() {
  const REDIRECT_URI = "http://albertof17.github.io/Youtify"
  //const REDIRECT_URI = "https://localhost:3000/callback";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
  const LOGOUT_ENDPOINT = 'https://www.spotify.com/logout/';
  const RESPONSE_TYPE = "token"
  const CLIENT_ID = "2d8b9cb8479a4de8b6eb8a863d30af0a";
  const CLIENT_SECRET = "fe023b67330a45608aa2eca95f1f327b";

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }

    fetch(TOKEN_ENDPOINT, authParameters)
      .then(result => result.json())
      .then(data => {
        const accessToken = data.access_token;
        window.localStorage.setItem('token', accessToken);
        setToken(accessToken);
      })
      .catch(error => {
        console.error('Error al obtener el token de acceso:', error);
      });
  }, []);

  const handleSearch = () => {
    if (!searchTerm) return;
    spotifyApi.searchTracks(searchTerm, { limit: 7 }).then((data) => {
      setSearchResults(data.tracks.items);
    });
  };

  function handleLogin() {
    const url = AUTH_ENDPOINT + '?client_id=' + CLIENT_ID + '&redirect_uri=' + REDIRECT_URI + '&response_type=token';
    var spotifyLoginWindow = window.open(url, 'Spotify Login', 'width=500,height=700,top=200,left=600');
    var intervalId = setInterval(function () {
      if (spotifyLoginWindow.location.href.includes('access_token')) {
        clearInterval(intervalId);
        spotifyLoginWindow.close();
        const token = spotifyLoginWindow.location.hash.substring(1).split('&')[0].split('=')[1];
        setToken(token);
        spotifyApi.setAccessToken(token);
      }
    }, 100);
  }


  async function handleLogout(token) {
    const url = LOGOUT_ENDPOINT;
    setToken(null);
    spotifyApi.setAccessToken(null);
    token = null;
    const spotifyLogoutWindow = window.open(url, 'Spotify Logout', 'width=500,height=700,top=200,left=600');
    setTimeout(() => spotifyLogoutWindow.close(), 2000);
  }

  //href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}

  return (
    <div className="App">
      <div id="Spotify">
        {token ? (
          <button className="logout" onClick={handleLogout}>Spotify Logout</button>
        ) : (<button className="logout" onClick={handleLogin}>Spotify Login</button>)}
        <h1>Spotify Player</h1>
        <div className="floating">
          <img id="Logo-Spotify" alt="Logo Spotify" className="giro" src={require("./Logo-Spotify.png")}></img>
        </div>
        <div id="buscador-Spotify">
          <div>
            <input id="input-Spotify" type="text" placeholder="Search for a track" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={event => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }} />
            <button id="boton-Spotify" onClick={handleSearch}>
              <svg version="1.1" viewBox="0 0 32 32">
                <path d="M27.414,24.586l-5.077-5.077C23.386,17.928,24,16.035,24,14c0-5.514-4.486-10-10-10S4,8.486,4,14 
              s4.486,10,10,10c2.035,0,3.928-0.614,5.509-1.663l5.077,5.077c0.78,0.781,2.048,0.781,2.828,0 
              C28.195,26.633,28.195,25.367,27.414,24.586z M7,14c0-3.86,3.14-7,7-7s7,3.14,7,7s-3.14,7-7,7S7,17.86,7,14z"/>
              </svg>
            </button>
          </div>
        </div>
        <ul id="resultado">
          {searchResults.map((track) => (
            <li key={track.id} onClick={() => {
              document.querySelector("#track").setAttribute('src', 'https://open.spotify.com/embed/track/' + (track.uri).substring((track.uri).lastIndexOf(":") + 1))
              document.querySelector("#track").className = "";
            }}><button id="boton-play" ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><g><path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z"></path></g></svg></button>
              {track.name} by {track.artists[0].name}
            </li>
          ))}
        </ul>
        <iframe title="track" id="track" allow="encrypted-media" className="hidden" src="" width="500" height="200" frameBorder="0"></iframe>
      </div>
      <div id="YouTube">
        <h1>YouTube Player</h1>
        <div className="floating">
          <img id="Logo-YouTube" alt="Logo YouTube" className="giro" src={require("./Logo-YouTube.png")}></img>
        </div>
        <YouTubeSearch />
      </div>
    </div>
  );
}

export default App;