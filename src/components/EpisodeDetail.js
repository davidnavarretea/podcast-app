import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../useAppContext";
import style from "../styles/EpisodeDetail.module.css";

const EpisodeDetail = () => {
  // Using useParams to get the podcast and episode id's from the URL
  const { podcastId, episodeId } = useParams();

  // Setting initial states for episode and podcast
  const [episode, setEpisode] = useState(null);
  const [podcast, setPodcast] = useState(null);

  // Extracting the setLoading function from the App context
  const { setLoading } = useAppContext();

  // UseEffect to make the API request when the component mounts
  useEffect(() => {
    // Setting the loading state to true
    setLoading(true);

    // Checking local storage for saved data
    const localStorageEpisodeDetail = localStorage.getItem(
      `episodeDetail-${episodeId}`
    );
    const localStoragePodcastDetail = localStorage.getItem(`podcastDetail`);
    const localStorageTimestamp = localStorage.getItem(
      `episodeDetailTimestamp-${episodeId}`
    );
    const currentTime = new Date().getTime();

    // If local storage has valid data, use it
    if (
      localStorageEpisodeDetail &&
      localStoragePodcastDetail &&
      localStorageTimestamp &&
      currentTime - localStorageTimestamp < 24 * 60 * 60 * 1000
    ) {
      setEpisode(JSON.parse(localStorageEpisodeDetail)); // Parse the stored episode data from local storage
      setPodcast(JSON.parse(localStoragePodcastDetail)); // Parse the stored podcast data from local storage
      setLoading(false); // Set loading state to false
    } else {
      // If no valid local data, fetch from API
      axios
        .get(
          `https://itunes.apple.com/lookup?id=${podcastId}&entity=podcastEpisode&limit=9`
        )
        .then((response) => {
          // Finding the specific episode from the API response
          const foundEpisode = response.data.results.find(
            (result) => result.trackId.toString() === episodeId
          );

          setEpisode(foundEpisode); // Set the found episode to state
          setPodcast(response.data.results[0]); // Set the podcast data to state

          // Storing the fetched data to local storage
          localStorage.setItem(
            `episodeDetail-${episodeId}`,
            JSON.stringify(foundEpisode)
          );
          localStorage.setItem(
            `podcastDetail`,
            JSON.stringify(response.data.results[0])
          );
          localStorage.setItem(
            `episodeDetailTimestamp-${episodeId}`,
            currentTime.toString()
          );

          setLoading(false); // Set loading state to false
        })
        .catch((error) => {
          // Log any errors
          console.error(error);
          setLoading(false); // Set loading state to false
        });
    }
  }, [podcastId, episodeId, setLoading]); // Dependencies for useEffect

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
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpisodeDetail;
