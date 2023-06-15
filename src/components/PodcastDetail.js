import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../useAppContext";

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
        const localData = JSON.parse(localStoragePodcastDetail);
        setPodcast(localData.podcast);
        setEpisodes(localData.episodes);

        // Sets the loading state to false
        setLoading(false);
      } else {
        // Makes an API request to fetch the podcast details and episodes from the iTunes API
        const result = await axios.get(
          `https://itunes.apple.com/lookup?id=${podcastId}&entity=podcastEpisode&limit=9`
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

        // Sets the loading state to false
        setLoading(false);
      }
    };

    fetchPodcastDetail();
  }, [podcastId, setLoading]);

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
