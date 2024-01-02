import { useState } from "react";
import {
  FolderName,
} from "../../../server/utils/database";

export const useFolders = () => {
  const [folders, setFolders] = useState<FolderName[]>([]);

  const getFolders = () => {
    fetch("/api/folders")
      .then((res) => res.json())
      .then((data) => {
        setFolders(data);
      })
      .catch((error) => console.error("Error fetching video files:", error));
  };

  return { folders, getFolders };
};
