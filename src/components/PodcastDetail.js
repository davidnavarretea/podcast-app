import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const PodcastDetail = () => {
  const [podcast, setPodcast] = useState({});
  const [episodes, setEpisodes] = useState([]);
  const { podcastId } = useParams();

  useEffect(() => {
    const fetchPodcastDetail = async () => {
      const localStoragePodcastDetail = localStorage.getItem(
        `podcastDetail-${podcastId}`
      );
      const localStorageTimestamp = localStorage.getItem(
        `podcastDetailTimestamp-${podcastId}`
      );
      const currentTime = new Date().getTime();

      if (
        localStoragePodcastDetail &&
        localStorageTimestamp &&
        currentTime - localStorageTimestamp < 24 * 60 * 60 * 1000
      ) {
        // Si los detalles del podcast están en el almacenamiento local y son recientes, los utilizamos
        const localData = JSON.parse(localStoragePodcastDetail);
        setPodcast(localData.podcast);
        setEpisodes(localData.episodes);
      } else {
        // Si no, obtenemos los detalles del podcast de la API
        const result = await axios.get(
          `https://itunes.apple.com/lookup?id=${podcastId}&entity=podcastEpisode&limit=9`
        );
        if (result.data.results && result.data.results.length > 0) {
          setPodcast(result.data.results[0]);
          setEpisodes(result.data.results.slice(1));

          // Guardamos los detalles del podcast en el almacenamiento local junto con el tiempo actual
          localStorage.setItem(
            `podcastDetail-${podcastId}`,
            JSON.stringify({
              podcast: result.data.results[0],
              episodes: result.data.results.slice(1),
            })
          );
          localStorage.setItem(
            `podcastDetailTimestamp-${podcastId}`,
            currentTime.toString()
          );
        }
      }
    };
    fetchPodcastDetail();
  }, [podcastId]);

  return (
    <div>
      <h2>{podcast.trackName}</h2>
      <img src={podcast.artworkUrl100} alt={podcast.trackName} />
      <p>{podcast.artistName}</p>
      <p>{podcast.description}</p>
      <h3>Episodios</h3>
      {episodes.map((episode) => (
        <div key={episode.trackId}>
          <Link to={`/podcast/${podcastId}/episode/${episode.trackId}`}>
            {episode.trackName}
          </Link>
          <p>{episode.releaseDate}</p>
          <p>{episode.trackTimeMillis}</p>
        </div>
      ))}
    </div>
  );
};

export default PodcastDetail;
