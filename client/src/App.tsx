// import ReactPlayer from "react-player";
import "video-react/dist/video-react.css";
import { Routes, Route } from "react-router-dom";
import { Theater } from "./pages/theater";
import { Gallery } from "./pages/gallery";
import { Navbar } from "./components/Navbar";
import { FolderView } from "./pages/folderView";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/theater" element={<Theater />} />
        <Route path="/folderView" element={<FolderView />} />
      </Routes>
    </>
  );
}

export default App;
