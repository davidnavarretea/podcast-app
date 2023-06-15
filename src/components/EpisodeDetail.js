import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EpisodeDetail = () => {
  const { podcastId, episodeId } = useParams();
  const [episode, setEpisode] = useState(null);

  useEffect(() => {
    const localStorageEpisodeDetail = localStorage.getItem(
      `episodeDetail-${episodeId}`
    );
    const localStorageTimestamp = localStorage.getItem(
      `episodeDetailTimestamp-${episodeId}`
    );
    const currentTime = new Date().getTime();

    if (
      localStorageEpisodeDetail &&
      localStorageTimestamp &&
      currentTime - localStorageTimestamp < 24 * 60 * 60 * 1000
    ) {
      // Si los detalles del episodio están en el almacenamiento local y son recientes, los utilizamos
      setEpisode(JSON.parse(localStorageEpisodeDetail));
    } else {
      // Si no, obtenemos los detalles del episodio de la API
      axios
        .get(
          `https://itunes.apple.com/lookup?id=${podcastId}&entity=podcastEpisode&limit=9`
        )
        .then((response) => {
          const foundEpisode = response.data.results.find(
            (result) => result.trackId.toString() === episodeId
          );
          setEpisode(foundEpisode);
          // Guardamos los detalles del episodio en el almacenamiento local junto con el tiempo actual
          localStorage.setItem(
            `episodeDetail-${episodeId}`,
            JSON.stringify(foundEpisode)
          );
          localStorage.setItem(
            `episodeDetailTimestamp-${episodeId}`,
            currentTime.toString()
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [podcastId, episodeId]);

  return (
    <div>
      {episode && (
        <>
          <h1>{episode.trackName}</h1>
          <p>{episode.description}</p>
          <audio controls src={episode.episodeUrl}>
            Tu navegador no soporta el elemento de audio.
          </audio>
        </>
      )}
    </div>
  );
};

export default EpisodeDetail;
