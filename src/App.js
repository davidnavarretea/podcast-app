import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainView from "./components/MainView";
import PodcastDetail from "./components/PodcastDetail";
import EpisodeDetail from "./components/EpisodeDetail";
import { AppWrapper } from "./useAppContext";
import Layout from "./Layout";

function App() {
  return (
    <Router>
      <AppWrapper>
        <Layout>
          <Routes>
            <Route path="/" element={<MainView />} />
            <Route path="/podcast/:podcastId" element={<PodcastDetail />} />
            <Route
              path="/podcast/:podcastId/episode/:episodeId"
              element={<EpisodeDetail />}
            />
          </Routes>
        </Layout>
      </AppWrapper>
    </Router>
  );
}

export default App;
