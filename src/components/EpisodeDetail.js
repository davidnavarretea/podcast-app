import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../useAppContext";
import style from "../styles/EpisodeDetail.module.css";

const EpisodeDetail = () => {
  const { podcastId, episodeId } = useParams();
  const [episode, setEpisode] = useState(null);
  const [podcast, setPodcast] = useState(null);
  const { setLoading } = useAppContext();

  useEffect(() => {
    setLoading(true);

    const localStorageEpisodeDetail = localStorage.getItem(
      `episodeDetail-${episodeId}`
    );
    const localStoragePodcastDetail = localStorage.getItem(`podcastDetail`);
    const localStorageTimestamp = localStorage.getItem(
      `episodeDetailTimestamp-${episodeId}`
    );
    const currentTime = new Date().getTime();

    if (
      localStorageEpisodeDetail &&
      localStoragePodcastDetail &&
      localStorageTimestamp &&
      currentTime - localStorageTimestamp < 24 * 60 * 60 * 1000
    ) {
      setEpisode(JSON.parse(localStorageEpisodeDetail));
      setPodcast(JSON.parse(localStoragePodcastDetail)); // Load podcast data from local storage
      setLoading(false);
    } else {
      axios
        .get(
          `https://itunes.apple.com/lookup?id=${podcastId}&entity=podcastEpisode&limit=9`
        )
        .then((response) => {
          const foundEpisode = response.data.results.find(
            (result) => result.trackId.toString() === episodeId
          );
          setEpisode(foundEpisode);
          setPodcast(response.data.results[0]);

          localStorage.setItem(
            `episodeDetail-${episodeId}`,
            JSON.stringify(foundEpisode)
          );
          localStorage.setItem(
            `podcastDetail`,
            JSON.stringify(response.data.results[0]) // Store podcast data in local storage
          );
          localStorage.setItem(
            `episodeDetailTimestamp-${episodeId}`,
            currentTime.toString()
          );
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [podcastId, episodeId, setLoading]);

  return (
    <div className={style.container}>
      {podcast && (
        <Link to={`/podcast/${podcastId}`} className={style.podcastCardLink}>
          <div className={style.podcastCard}>
            <img
              src={podcast.artworkUrl100}
              alt={podcast.trackName}
              className={style.podcastImage}
            />
            <h2 className={style.podcastTitle}>{podcast.trackName}</h2>
            <p className={style.podcastArtist}>by {podcast.artistName}</p>
          </div>
        </Link>
      )}
      {episode && (
        <div className={style.episodeCard}>
          <h1 className={style.episodeTitle}>{episode.trackName}</h1>
          <p className={style.episodeDescription}>{episode.description}</p>
          <div className={style.audioPlayerContainer}>
            <audio
              controls
              src={episode.episodeUrl}
              className={style.audioPlayer}
            >
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpisodeDetail;
