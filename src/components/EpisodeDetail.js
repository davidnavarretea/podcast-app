import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EpisodeDetail = () => {
  const { podcastId, episodeId } = useParams();
  const [episode, setEpisode] = useState(null);

  useEffect(() => {
    axios
      .get(
        `https://itunes.apple.com/lookup?id=${podcastId}&entity=podcastEpisode&limit=9`
      )
      .then((response) => {
        const foundEpisode = response.data.results.find(
          (result) => result.trackId.toString() === episodeId
        );
        setEpisode(foundEpisode);
      })
      .catch((error) => {
        console.error(error);
      });
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
