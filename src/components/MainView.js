import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MainView = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get(
        "https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json"
      )
      .then((response) => {
        setPodcasts(response.data.feed.entry);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSearch = (event) => {
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
      <input type="text" onChange={handleSearch} placeholder="Buscar podcast" />
      {filteredPodcasts.map((podcast, index) => (
        <div key={index}>
          <Link to={`/podcast/${podcast.id.attributes["im:id"]}`}>
            <h2>{podcast.title.label}</h2>
            <img src={podcast["im:image"][2].label} alt={podcast.title.label} />
            <p>{podcast["im:artist"].label}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MainView;
