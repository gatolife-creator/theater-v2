import { useState } from "react";
import { VideoId, VideoData, FolderName } from "../../../server/utils/database";

export const useVideos = () => {
  const [videos, setVideos] = useState<[VideoId, VideoData][]>([]);

  const getVideos = (foldername: FolderName) => {
    fetch(`/api/folder/${foldername}`)
      .then((res) => res.json())
      .then((data) => {
        setVideos(Object.entries(data));
      })
      .catch((error) => console.error("Error fetching video files:", error));
  };

  return { videos, getVideos };
};