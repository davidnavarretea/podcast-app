import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAppContext } from "../useAppContext";

const EpisodeDetail = () => {
  // Retrieves the podcastId and episodeId from URL parameters
  const { podcastId, episodeId } = useParams();

  // Manages the state for the episode details
  const [episode, setEpisode] = useState(null);

  // Retrieves the setLoading function from the app context
  const { setLoading } = useAppContext();

  useEffect(() => {
    // Sets the loading state to true
    setLoading(true);

    // Retrieves episode details from local storage if they exist and are recent
    const localStorageEpisodeDetail = localStorage.getItem(
      `episodeDetail-${episodeId}`
    );
    const localStorageTimestamp = localStorage.getItem(
      `episodeDetailTimestamp-${episodeId}`
    );
    const currentTime = new Date().getTime();

    // Checks if the episode details exist in local storage and are still valid
    if (
      localStorageEpisodeDetail &&
      localStorageTimestamp &&
      currentTime - localStorageTimestamp < 24 * 60 * 60 * 1000
    ) {
      // Sets the episode state to the cached episode details
      setEpisode(JSON.parse(localStorageEpisodeDetail));

      // Sets the loading state to false
      setLoading(false);
    } else {
      // Makes an API request to fetch the episode details from the iTunes API
      axios
        .get(
          `https://itunes.apple.com/lookup?id=${podcastId}&entity=podcastEpisode&limit=9`
        )
        .then((response) => {
          // Finds the episode matching the given episodeId from the API response
          const foundEpisode = response.data.results.find(
            (result) => result.trackId.toString() === episodeId
          );

          // Sets the episode state to the fetched episode details
          setEpisode(foundEpisode);

          // Stores the fetched episode details in local storage
          localStorage.setItem(
            `episodeDetail-${episodeId}`,
            JSON.stringify(foundEpisode)
          );
          localStorage.setItem(
            `episodeDetailTimestamp-${episodeId}`,
            currentTime.toString()
          );

          // Sets the loading state to false
          setLoading(false);
        })
        .catch((error) => {
          // Logs any errors that occur during the API request
          console.error(error);

          // Sets the loading state to false
          setLoading(false);
        });
    }
  }, [podcastId, episodeId, setLoading]);

  // Renders the episode details if they exist
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
