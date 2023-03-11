import React, { useState } from "react";
import axios from "axios";

//SI LA API DE YT NO FUNCIONA
//https://console.cloud.google.com/cloud-resource-manager?previousPage=%2Fapis%2Fcredentials%3Fproject%3Dpelagic-rig-378600&organizationId=0
//CREAR PROYECTO
//BIBLIOTECA https://console.cloud.google.com/apis/library?project=pelagic-rig-378600
//HABILITAR YOUTUBE DATA API V3
//Y EN CREDENCIALES https://console.cloud.google.com/apis/credentials?project=pelagic-rig-378600 LE DAS A CREAR CREDENCIALES Y CLAVE DE API

function YouTubeSearch() {
    const API_KEY = 'AIzaSyC3DibgUpVxJyI_0XHU52VfvOOkHeZVjPY';
    const [searchTerm, setSearchTerm] = useState("");
    const [videos, setVideos] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);

    // // Configura la información de autenticación
    // const authOptions = {
    //     clientId: 'CLIENT_ID',
    //     clientSecret: 'CLIENT_SECRET',
    //     refreshToken: 'REFRESH_TOKEN'
    // };

    // // Crea un cliente de autenticación de actualización de usuario
    // const authClient = new UserRefreshClient(authOptions);

    // // Función para actualizar el token de acceso
    // async function refreshAccessToken() {
    //     try {
    //         const { credentials } = await authClient.getAccessToken();
    //         // Aquí actualizas el token en tu aplicación
    //         console.log('Nuevo token de acceso:', credentials.access_token);
    //     } catch (err) {
    //         console.error('Error al actualizar el token de acceso:', err.message);
    //     }
    // }

    // // Llama a la función para actualizar el token cada hora
    // setInterval(refreshAccessToken, 60 * 60 * 1000);

    const handleSearch = async (event) => {
        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&maxResults=10&type=video&q=${searchTerm}`
        );
        setVideos(response.data.items);
        setSelectedVideo(null);
    };

    const handleVideoSelect = (video) => {
        setSelectedVideo(video);
        setVideos(null);
    };

    const handleClearResults = () => {
        setVideos(null);
        setSelectedVideo(null);
    }
//    const { UserRefreshClient } = require('google-auth-library');

    return (
        <div>
            <div id="buscador-Spotify">
                <div>
                    <input id="input-Spotify" type="text" placeholder="Search for a video" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={event => {
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
            {selectedVideo ? (
                <div id="video">
                    <button id="boton-borrar" onClick={handleClearResults}>Borrar</button>
                    <iframe
                        width="800"
                        height="450"
                        src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}`}
                        title={selectedVideo.snippet.title}
                        frameBorder='0'
                    ></iframe>
                    <h2>{selectedVideo.snippet.title}</h2>
                </div>
            ) : videos ? (
                <div id='resultados-YouTube'>
                    <button id="boton-borrar" onClick={handleClearResults}>Borrar</button>
                    <ul id='lista-resultados'>
                        {videos.map((video) => (
                            <li key={video.id.videoId}>
                                <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} onClick={() => handleVideoSelect(video)} />
                                <h2>{video.snippet.title}</h2>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (<div></div>)}
        </div>
    );
}

export default YouTubeSearch;