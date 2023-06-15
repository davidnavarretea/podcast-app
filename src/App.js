import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainView from "./components/MainView";
import PodcastDetail from "./components/PodcastDetail";
import EpisodeDetail from "./components/EpisodeDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/podcast/:podcastId" element={<PodcastDetail />} />
        <Route
          path="/podcast/:podcastId/episode/:episodeId"
          element={<EpisodeDetail />}
        />
      </Routes>
    </Router>
  );
}

export default App;
