import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAppContext } from "../useAppContext";
import style from "../styles/MainView.module.css";

const MainView = () => {
  // Manages the state for the podcasts and search term
  const [podcasts, setPodcasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Retrieves the setLoading function from the app context
  const { setLoading } = useAppContext();

  useEffect(() => {
    // Sets the loading state to true
    setLoading(true);

    // Retrieves podcasts from local storage if they exist and are recent
    const localStoragePodcasts = localStorage.getItem("podcasts");
    const localStorageTimestamp = localStorage.getItem("timestamp");
    const currentTime = new Date().getTime();

    // Checks if the podcasts exist in local storage and are still valid
    if (
      localStoragePodcasts &&
      localStorageTimestamp &&
      currentTime - localStorageTimestamp < 24 * 60 * 60 * 1000
    ) {
      // Sets the podcasts state to the cached podcasts
      setPodcasts(JSON.parse(localStoragePodcasts));

      // Sets the loading state to false
      setLoading(false);
    } else {
      // Makes an API request to fetch the top podcasts from the iTunes API
      axios
        .get(
          "https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json"
        )
        .then((response) => {
          // Sets the podcasts state to the fetched podcasts
          setPodcasts(response.data.feed.entry);

          // Stores the fetched podcasts in local storage
          localStorage.setItem(
            "podcasts",
            JSON.stringify(response.data.feed.entry)
          );
          localStorage.setItem("timestamp", currentTime.toString());

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
  }, [setLoading]);

  const handleSearch = (event) => {
    // Updates the search term state with the input value
    setSearchTerm(event.target.value);
  };

  const filteredPodcasts = podcasts.filter(
    (podcast) =>
      podcast.title.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      podcast["im:artist"].label
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className={style.searchDiv}>
        <p className={style.podcastLength}>{podcasts.length}</p>
        <input
          className={style.searchInput}
          type="text"
          onChange={handleSearch}
          placeholder="Filter podcast..."
        />
      </div>
      <div className={style.podcastGrid}>
        {filteredPodcasts.map((podcast, index) => (
          <div key={index} className={style.podcastCard}>
            <Link
              className={style.podcastLink}
              to={`/podcast/${podcast.id.attributes["im:id"]}`}
            >
              <img
                className={style.podcastImage}
                src={podcast["im:image"][2].label}
                alt={podcast.title.label}
              />
              <h2 className={style.title}>{podcast["im:name"].label}</h2>
              <p className={style.artist}>{podcast["im:artist"].label}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainView;
