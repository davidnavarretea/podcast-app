import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const PodcastDetail = () => {
  const [podcast, setPodcast] = useState({});
  const [episodes, setEpisodes] = useState([]);
  const { podcastId } = useParams();

  useEffect(() => {
    const fetchPodcastDetail = async () => {
      const result = await axios.get(
        `https://itunes.apple.com/lookup?id=${podcastId}&entity=podcastEpisode&limit=9`
      );
      if (result.data.results && result.data.results.length > 0) {
        setPodcast(result.data.results[0]);
        setEpisodes(result.data.results.slice(1));
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
