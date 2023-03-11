import React, { useState, useEffect } from "react";
import SpotifyWebApi from "./spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

function SpotifyLoginCheck({ token }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkIfUserIsLoggedIn = async () => {
      if (token) {
        try {
          await spotifyApi.getMe();
          setLoggedIn(true);
        } catch (e) {
          setLoggedIn(false);
        }
      } else {
        setLoggedIn(false);
      }
    };
    checkIfUserIsLoggedIn();
  }, [token]);

  return (
    <div>
      {loggedIn ? (
        <p>El usuario ha iniciado sesión en Spotify</p>
      ) : (
        <p>El usuario no ha iniciado sesión en Spotify</p>
      )}
    </div>
  );
}

export default SpotifyLoginCheck;