import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../useAppContext";
import style from "../styles/PodcastDetail.module.css";

const PodcastDetail = () => {
  // Manages the state for the podcast and episodes
  const [podcast, setPodcast] = useState({});
  const [episodes, setEpisodes] = useState([]);

  // Retrieves the podcastId from URL parameters
  const { podcastId } = useParams();

  // Retrieves the setLoading function from the app context
  const { setLoading } = useAppContext();

  useEffect(() => {
    // Sets the loading state to true
    setLoading(true);

    const fetchPodcastDetail = async () => {
      // Retrieves podcast details from local storage if they exist and are recent
      const localStoragePodcastDetail = localStorage.getItem(
        `podcastDetail-${podcastId}`
      );
      const localStorageTimestamp = localStorage.getItem(
        `podcastDetailTimestamp-${podcastId}`
      );
      const currentTime = new Date().getTime();

      // Checks if the podcast details exist in local storage and are still valid
      if (
        localStoragePodcastDetail &&
        localStorageTimestamp &&
        currentTime - localStorageTimestamp < 24 * 60 * 60 * 1000
      ) {
        try {
          const localData = JSON.parse(localStoragePodcastDetail);
          setPodcast(localData.podcast);
          setEpisodes(localData.episodes);
        } catch (error) {
          // Logs any errors that occur during JSON parsing
          console.error(
            "Error parsing podcast detail from local storage:",
            error
          );
        }

        // Sets the loading state to false
        setLoading(false);
      } else {
        try {
          // Makes an API request to fetch the podcast details and episodes from the iTunes API
          const result = await axios.get(
            `https://itunes.apple.com/lookup?id=${podcastId}&entity=podcastEpisode`
          );

          if (result.data.results && result.data.results.length > 0) {
            // Sets the podcast state to the fetched podcast details
            setPodcast(result.data.results[0]);

            // Sets the episodes state to the fetched episodes
            setEpisodes(result.data.results.slice(1));

            // Stores the fetched podcast details and episodes in local storage
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
        } catch (error) {
          // Logs any errors that occur during the API request
          console.error("Error fetching podcast details from API:", error);
        }

        // Sets the loading state to false
        setLoading(false);
      }
    };

    fetchPodcastDetail();
  }, [podcastId, setLoading]);

  return (
    <div className={style.container}>
      <div className={style.podcastCard}>
        <img
          src={podcast.artworkUrl100}
          alt={podcast.trackName}
          className={style.podcastImage}
        />
        <h2 className={style.podcastTitle}>{podcast.trackName}</h2>
        <p className={style.podcastArtist}>by {podcast.artistName}</p>
      </div>

      <div className={style.episodesSection}>
        <div className={style.episodeCount}>
          <h3>Episodes: {podcast.trackCount}</h3>
        </div>
        <div className={style.episodeList}>
          {episodes.map((episode, index) => (
            <Link
              to={`/podcast/${podcastId}/episode/${episode.trackId}`}
              key={episode.trackId}
              className={index % 2 === 0 ? style.episodeOdd : style.episodeEven}
            >
              <div className={style.episodeTitle}>{episode.trackName}</div>
              <div className={style.episodeDate}>{episode.releaseDate}</div>
              <div className={style.episodeDuration}>
                {episode.trackTimeMillis}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PodcastDetail;
